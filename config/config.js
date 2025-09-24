window.addEventListener('load', function () {
  console.log('Page loaded, initializing CKEditor');

  // Initialize CKEditor with custom config for each instance
  CKEDITOR.replace('product_description', {
    versionCheck: false, // Explicitly disable version check here
    language: 'en',
    skin: 'moono-lisa',
    height: 400,
    toolbar: 'Standard'
  });

  CKEDITOR.replace('product_summary', {
    versionCheck: false, // Explicitly disable version check here
    language: 'en',
    skin: 'moono-lisa',
    height: 400,
    toolbar: 'Standard'
  });
});