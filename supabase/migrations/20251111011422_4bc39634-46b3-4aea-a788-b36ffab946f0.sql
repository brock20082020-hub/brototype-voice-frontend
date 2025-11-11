-- Create storage bucket for complaint screenshots
insert into storage.buckets (id, name, public)
values ('complaint-screenshots', 'complaint-screenshots', true);

-- Create storage policies for complaint screenshots
create policy "Anyone can view complaint screenshots"
  on storage.objects for select
  using (bucket_id = 'complaint-screenshots');

create policy "Students can upload their own screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'complaint-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Students can update their own screenshots"
  on storage.objects for update
  using (
    bucket_id = 'complaint-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Students can delete their own screenshots"
  on storage.objects for delete
  using (
    bucket_id = 'complaint-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );