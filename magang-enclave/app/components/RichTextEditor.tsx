'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        apiKey='52v23btzbq7m1mnvsouhn5ei5svjgxn50ly89wdt8yorrk5l'
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 500,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            // Core editing features
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link',
            'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            // Premium features (trial sampai Feb 10, 2026)
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed',
            'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste',
            'advtable', 'advcode', 'advtemplate', 'mentions',
            'tableofcontents', 'footnotes', 'autocorrect', 'typography',
            'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
            'link media table | align lineheight | checklist numlist bullist indent outdent | ' +
            'emoticons charmap | forecolor backcolor | casechange formatpainter | ' +
            'spellcheckdialog a11ycheck typography | removeformat code fullscreen',
          toolbar_mode: 'sliding',
          font_size_formats: '8px 9px 10px 11px 12px 14px 16px 18px 20px 22px 24px 26px 28px 36px 48px 72px',
          font_family_formats: 'Arial=arial,helvetica,sans-serif; Calibri=calibri,sans-serif; ' +
            'Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier,monospace; ' +
            'Georgia=georgia,palatino,serif; Helvetica=helvetica,sans-serif; ' +
            'Impact=impact,sans-serif; Lucida Sans=lucida sans unicode,lucida grande,sans-serif; ' +
            'Tahoma=tahoma,arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; ' +
            'Trebuchet MS=trebuchet ms,geneva,sans-serif; Verdana=verdana,geneva,sans-serif',
          line_height_formats: '1 1.1 1.2 1.3 1.4 1.5 1.75 2 2.5 3',
          placeholder: placeholder || 'Mulai menulis...',
          branding: false,
          promotion: false,
          statusbar: true,
          contextmenu: 'link image table spellchecker',
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote formatpainter',
          quickbars_insert_toolbar: 'quickimage quicktable',
          image_advtab: true,
          image_uploadtab: true,
          images_upload_handler: function (blobInfo: any) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = function() {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(blobInfo.blob());
            });
          },
          table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          table_appearance_options: true,
          table_grid: true,
          table_cell_advtab: true,
          table_row_advtab: true,
          paste_data_images: true,
          paste_as_text: false,
          advcode_inline: true,
          content_style: `
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.5;
              padding: 10px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            table td, table th {
              border: 1px solid #ddd;
              padding: 8px;
            }
          `
        }}
      />
    </div>
  );
}
