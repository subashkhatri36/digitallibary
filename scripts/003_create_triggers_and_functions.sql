-- Triggers and Functions for Digital Library Platform

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update book ratings when review is added/updated
CREATE OR REPLACE FUNCTION public.update_book_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update book's average rating and total ratings
  UPDATE public.books
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.book_reviews
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id) AND is_approved = true
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM public.book_reviews
      WHERE book_id = COALESCE(NEW.book_id, OLD.book_id) AND is_approved = true
    )
  WHERE id = COALESCE(NEW.book_id, OLD.book_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to update book ratings
DROP TRIGGER IF EXISTS update_book_rating_trigger ON public.book_reviews;
CREATE TRIGGER update_book_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.book_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_book_rating();

-- Function to update reading progress
CREATE OR REPLACE FUNCTION public.update_reading_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update user's total books read if book is completed
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    UPDATE public.profiles
    SET total_books_read = total_books_read + 1
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update user stats when reading progress changes
DROP TRIGGER IF EXISTS update_user_stats_trigger ON public.reading_progress;
CREATE TRIGGER update_user_stats_trigger
  AFTER UPDATE ON public.reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reading_progress();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON public.reading_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_book_reviews_updated_at BEFORE UPDATE ON public.book_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reading_lists_updated_at BEFORE UPDATE ON public.reading_lists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
