// ckeditor
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import InlineEditor from '@ckeditor/ckeditor5-build-classic';
//import BaloonEditor from '@ckeditor/ckeditor5-build-classic';
export const setEditorById = id => {
    return ClassicEditor.create(id, {
        placeholder: "detailnya gimana?"
    })
    .then(newEditor => newEditor)
    .catch(error => {
        console.log(error.stack);
    });
};