'use server';

 
async function fetchContent() {
  try {
    const response = await fetch('https://www.1024terabox.com/sharing/embed?surl=EWkWY66FhZKS2WfxwBgd0Q&autoplay=true&mute=false');
    return await response.text();
  } catch (error) {
    console.error('Error fetching content:', error);
    return '';
  }
}

export default async function TeraboxContent() {
  const content = await fetchContent();

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}
