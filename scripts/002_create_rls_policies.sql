-- Row Level Security Policies for Digital Library Platform

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Authors policies (public read, admin write)
CREATE POLICY "authors_select_all" ON public.authors FOR SELECT TO authenticated USING (true);
CREATE POLICY "authors_admin_all" ON public.authors FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND subscription_tier = 'admin'
  )
);

-- Genres policies (public read, admin write)
CREATE POLICY "genres_select_all" ON public.genres FOR SELECT TO authenticated USING (true);
CREATE POLICY "genres_admin_all" ON public.genres FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND subscription_tier = 'admin'
  )
);

-- Books policies (public read, admin write)
CREATE POLICY "books_select_all" ON public.books FOR SELECT TO authenticated USING (true);
CREATE POLICY "books_admin_all" ON public.books FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND subscription_tier = 'admin'
  )
);

-- Book pages policies (access based on user library and preview limits)
CREATE POLICY "book_pages_preview_access" ON public.book_pages FOR SELECT USING (
  -- Allow preview pages for everyone
  page_number <= (SELECT preview_pages FROM public.books WHERE id = book_id)
  OR
  -- Allow full access if user owns the book
  EXISTS (
    SELECT 1 FROM public.user_library ul
    WHERE ul.user_id = auth.uid() 
    AND ul.book_id = book_pages.book_id
    AND ul.access_type IN ('purchased', 'subscription')
  )
);

CREATE POLICY "book_pages_admin_all" ON public.book_pages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND subscription_tier = 'admin'
  )
);

-- Book tags policies (public read, admin write)
CREATE POLICY "book_tags_select_all" ON public.book_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "book_tags_admin_all" ON public.book_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND subscription_tier = 'admin'
  )
);

-- User library policies
CREATE POLICY "user_library_select_own" ON public.user_library FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_library_insert_own" ON public.user_library FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_library_update_own" ON public.user_library FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_library_delete_own" ON public.user_library FOR DELETE USING (auth.uid() = user_id);

-- Reading progress policies
CREATE POLICY "reading_progress_select_own" ON public.reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reading_progress_insert_own" ON public.reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reading_progress_update_own" ON public.reading_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reading_progress_delete_own" ON public.reading_progress FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "bookmarks_select_own" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert_own" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_update_own" ON public.bookmarks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete_own" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Book reviews policies
CREATE POLICY "book_reviews_select_approved" ON public.book_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "book_reviews_select_own" ON public.book_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "book_reviews_insert_own" ON public.book_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "book_reviews_update_own" ON public.book_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "book_reviews_delete_own" ON public.book_reviews FOR DELETE USING (auth.uid() = user_id);

-- Reading lists policies
CREATE POLICY "reading_lists_select_public" ON public.reading_lists FOR SELECT USING (is_public = true);
CREATE POLICY "reading_lists_select_own" ON public.reading_lists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reading_lists_insert_own" ON public.reading_lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reading_lists_update_own" ON public.reading_lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reading_lists_delete_own" ON public.reading_lists FOR DELETE USING (auth.uid() = user_id);

-- Reading list items policies
CREATE POLICY "reading_list_items_select_public" ON public.reading_list_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.reading_lists rl
    WHERE rl.id = list_id AND (rl.is_public = true OR rl.user_id = auth.uid())
  )
);
CREATE POLICY "reading_list_items_manage_own" ON public.reading_list_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.reading_lists rl
    WHERE rl.id = list_id AND rl.user_id = auth.uid()
  )
);

-- Wishlist policies
CREATE POLICY "wishlist_select_own" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
