// src/CKEditor4.js
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { CKEditor } from 'ckeditor4-react';
import $ from 'jquery';

const CKEditor4 = ({ data, handleChange }) => {
  const editorRef = useRef(null);
  const [isReady, setIsReady] = useState(false); // Track editor readiness

  const config = useMemo(() => ({
    toolbar: [
      { name: 'document', items: ['Source', '-', 'NewPage', 'Preview'] },
      { name: 'clipboard', items: ['Undo', 'Redo'] },
      { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', '-', 'RemoveFormat'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
      { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
      { name: 'links', items: ['Link', 'Unlink'] },
      { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
    ],
    extraPlugins: 'colorbutton,font,justify,showblocks,sourcearea',
    resize_enabled: false,
    placeholder: 'Type or paste your content here!',
    on: {
      instanceReady: function (evt) {
        editorRef.current = evt.editor;
        setIsReady(true); // Set editor ready
        setTimeout(() => {
          $(".cke_notifications_area").remove();
        }, 10);
      }
    }
  }), []);

  // ⚠️ Only update when editor is ready
  useEffect(() => {
    if (isReady && editorRef.current) {
      const currentData = editorRef.current.getData();
      if (currentData !== data) {
        editorRef.current.setData(data || '');
      }
    }
  }, [data, isReady]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
      <CKEditor
        initData={data}
        onChange={handleChange}
        config={config}
      />
    </div>
  );
};

export default React.memo(CKEditor4);
