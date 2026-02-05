"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { X, Plus, Minus } from "lucide-react";

// --- KONFIGURASI DATA ---

// Daftar Tag Template (Hijau)
const TAG_TEMPLATES = [
  { key: 'instansi_penerima', label: 'Instansi Penerima', icon: '🏢' },
  { key: 'tanggal_surat', label: 'Tanggal Surat', icon: '📅' },
  { key: 'no_surat', label: 'Nomor Surat', icon: '🔖' },
  { key: 'jumlah_lampiran', label: 'Jumlah Lampiran', icon: '📎' },
  { key: 'status_surat', label: 'Status Surat', icon: '🚩' },
  { key: 'judul_surat', label: 'Judul Surat', icon: '📝' },
];

// Tipe untuk Tag
interface TagTemplate {
  key: string;
  label: string;
  icon?: string;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const [pageCount, setPageCount] = useState(1);
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [pendingTag, setPendingTag] = useState<TagTemplate | null>(null);
  const [customValue, setCustomValue] = useState("");

  // --- LOGIKA EDITOR ---

  const updatePageCount = useCallback((content: string) => {
    const textLength = content.replace(/<[^>]*>/g, '').length;
    const estimatedPages = Math.max(1, Math.ceil(textLength / 3000));
    setPageCount(estimatedPages);
  }, []);

  const handleEditorChange = useCallback((content: string) => {
    onChange(content);
    updatePageCount(content);
  }, [onChange, updatePageCount]);

  // Fungsi untuk menyisipkan tag (baik dari panel samping maupun autocompleter)
  const insertTag = useCallback((tagKey: string, isGreen: boolean = true) => {
    if (editorRef.current) {
      const className = isGreen ? 'tag-template' : 'tag-custom';
      const spanHtml = `<span class="${className}">{{${tagKey}}}</span>&nbsp;`;
      editorRef.current.insertContent(spanHtml);
      editorRef.current.focus();
    }
  }, []);

  // Handle klik tag di Sidebar
  const handleTagClick = useCallback((tag: TagTemplate) => {
    insertTag(tag.key, true); // Tag dari sidebar selalu hijau
  }, [insertTag]);

  // Handle submit modal custom tag (Merah)
  const handleCustomValueSubmit = () => {
    if (pendingTag && customValue) {
      insertTag(customValue, false); // Tag manual merah
      setPendingTag(null);
      setCustomValue("");
    }
  };

  const toggleTagPanel = () => {
    setShowTagPanel(!showTagPanel);
  };

  return (
    <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm h-[850px]">
      
      {/* Sidebar Panel Tags */}
      <div className="bg-white border-r border-gray-300 flex flex-col items-center py-2 px-1 gap-2 w-16 flex-shrink-0 z-10">
        <button
          onClick={toggleTagPanel}
          className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title={showTagPanel ? "Sembunyikan Tags" : "Tampilkan Tags"}
        >
          {showTagPanel ? <Minus size={18} /> : <Plus size={18} />}
        </button>

        {showTagPanel && (
          <div className="flex-1 overflow-y-auto space-y-2 py-2 w-full">
            <p className="text-[10px] font-bold text-green-700 text-center px-1 uppercase tracking-wide">
              Template
            </p>
            {TAG_TEMPLATES.map((tag) => (
              <button
                key={tag.key}
                onClick={() => handleTagClick(tag)}
                className="w-full px-1 py-2 text-[10px] rounded hover:bg-green-50 transition-colors text-left flex flex-col items-center justify-center gap-1 text-gray-700 border border-transparent hover:border-green-200"
                title={tag.label}
              >
                <span className="text-lg">{tag.icon}</span>
                <span className="leading-tight text-center line-clamp-2">{tag.label}</span>
              </button>
            ))}
            
            <div className="h-px bg-gray-200 my-2"></div>

            <button
              onClick={() => setPendingTag({ key: 'custom', label: 'Custom Tag' })}
              className="w-full px-1 py-2 text-[10px] rounded hover:bg-red-50 transition-colors text-left flex flex-col items-center justify-center gap-1 text-red-600 border border-transparent hover:border-red-200"
              title="Buat Tag Custom"
            >
              <Plus size={16} />
              <span>Custom</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
        
        {/* Toolbar Info */}
        <div className="bg-white border-b border-gray-300 px-4 py-2 flex justify-between items-center text-xs text-gray-600 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-700">📄 Template Surat A4</span>
            <span className="text-gray-300">|</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{pageCount} Halaman</span>
          </div>
          <div className="text-gray-400">21cm × 29.7cm</div>
        </div>

        {/* TinyMCE Container */}
        <div className="flex-1 p-4 overflow-auto flex justify-center bg-gray-100">
          <div className="bg-white shadow-md" style={{ width: '21cm', minHeight: '29.7cm' }}>
            <Editor
              apiKey='52v23btzbq7m1mnvsouhn5ei5svjgxn50ly89wdt8yorrk5l' // Pastikan API Key valid
              onInit={(evt, editor) => {
                editorRef.current = editor;
                updatePageCount(editor.getContent());
              }}
              value={value}
              onEditorChange={handleEditorChange}
              init={{
                height: 1100, // Tinggi area editor
                width: '100%',
                menubar: false, // Sembunyikan menu bar atas agar bersih
                plugins: [
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link',
                  'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                  'pagebreak', 'code', 'fullscreen', 'preview', 'insertdatetime',
                  'checklist', 'mediaembed', 'casechange', 'formatpainter',
                  'advtable', 'advcode', 'advtemplate',
                  'tableofcontents', 'footnotes', 'autocorrect', 'typography',
                  'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf',
                  'quickbars' // Untuk toolbar cepat saat select text
                ],
                toolbar: [
                  'undo redo | styles fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor',
                  'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | pagebreak',
                  'removeformat code fullscreen preview'
                ],
                toolbar_mode: 'wrap',
                
                // Konfigurasi Font
                font_size_formats: '8pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 36pt',
                font_family_formats: 'Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times,serif; Courier New=courier new,courier,monospace;',
                line_height_formats: '1 1.2 1.5 2',

                placeholder: placeholder || 'Ketik konten surat di sini. Gunakan {{ untuk memunculkan tag...',

                // --- SETUP TAMBAHAN UNTUK TAGGING ---
                setup: (editor) => {
                  // 1. REGISTER AUTOCOMPLETER (Dropdown Hijau)
                  editor.ui.registry.addAutocompleter('tagAutocompleter', {
                    trigger: '{{',
                    minChars: 0,
                    columns: 1,
                    highlightOn: ['label'],
                    fetch: (pattern) => {
                      return new Promise((resolve) => {
                        // Filter tag template berdasarkan ketikan user
                        const filteredTags = TAG_TEMPLATES.filter(tag => 
                          tag.key.includes(pattern) || tag.label.toLowerCase().includes(pattern.toLowerCase())
                        );
                        
                        const results = filteredTags.map(tag => ({
                          type: 'autocompleteitem' as const,
                          value: tag.key, // Value yang akan diambil onAction
                          text: tag.label, // Tampilan di dropdown
                        }));
                        
                        resolve(results);
                      });
                    },
                    onAction: (api, rng, value) => {
                      // Saat user memilih item dari dropdown
                      editor.selection.setRng(rng);
                      insertTag(value, true); // Insert tag Hijau
                      api.hide(); // Tutup dropdown
                    }
                  });

                  // 2. REGISTER MANUAL TYPING DETECTION (Deteksi Tag Merah/Hijau saat ketik '}}')
                  editor.on('keyup', (e) => {
                    if (e.key === '}') {
                      const sel = editor.selection.getRng();
                      const node = sel.startContainer;
                      
                      // Pastikan kita berada di dalam text node
                      if (node.nodeType === 3) { 
                        const text = node.textContent;
                        const cursorPos = sel.startOffset;
                        
                        // Ambil teks dari awal sampai posisi kursor
                        if (!text) return;
                        const textBeforeCursor = text.substring(0, cursorPos);
                        
                        // Cari pola {{...}} terakhir
                        // Regex mencari {{ diikuti apapun selain }} lalu ditutup }}
                        const match = textBeforeCursor.match(/{{(.*?)}}$/);
                        
                        if (match) {
                          const tagContent = match[1]; // Isi di dalam kurung
                          const fullMatch = match[0]; // Seluruh string {{...}}
                          const startIndex = cursorPos - fullMatch.length;
                          
                          // Cek apakah ini Tag Template (Hijau) atau Custom (Merah)
                          const isTemplate = TAG_TEMPLATES.some(t => t.key === tagContent);
                          
                          // Kita hanya ingin memproses jika ini bukan template yang SUDAH berwarna hijau
                          // (Mencegah re-wrapping jika user mengedit tag hijau)
                          // Namun, logika sederhana: wrap jika belum ada span.
                          
                          // Set range untuk memilih teks {{...}}
                          const range = document.createRange();
                          range.setStart(node, startIndex);
                          range.setEnd(node, cursorPos);
                          
                          editor.selection.setRng(range);
                          
                          // Tentukan kelas warna
                          // Jika user mengetik tag yang SAMA PERSIS dengan template, kita buat hijau.
                          // Jika beda, kita buat merah.
                          const cssClass = isTemplate ? 'tag-template' : 'tag-custom';
                          
                          // Insert span yang sudah di-wrap
                          // Menggunakan &nbsp; di akur agar cursor keluar dari span
                          editor.execCommand('mceInsertContent', false, `<span class="${cssClass}">${fullMatch}</span>&nbsp;`);
                        }
                      }
                    }
                  });
                },

                // --- STYLING UNTUK TAGS ---
                content_style: `
                  @page { size: A4; margin: 2cm; }
                  body { font-family: 'Arial', sans-serif; font-size: 12pt; line-height: 1.5; color: #000; padding: 2cm; }
                  
                  /* Tag Hijau (Template) */
                  .tag-template {
                    background-color: #dcfce7; /* green-100 */
                    color: #166534; /* green-800 */
                    padding: 0px 4px;
                    border-radius: 4px;
                    font-weight: 600;
                    border: 1px solid #bbf7d0;
                    display: inline-block;
                    vertical-align: middle;
                  }

                  /* Tag Merah (Custom) */
                  .tag-custom {
                    background-color: #fee2e2; /* red-100 */
                    color: #991b1b; /* red-800 */
                    padding: 0px 4px;
                    border-radius: 4px;
                    font-weight: 600;
                    border: 1px solid #fecaca;
                    display: inline-block;
                    vertical-align: middle;
                  }

                  /* Agar tag terlihat rapi */
                  p { margin-bottom: 12pt; }
                  table { width: 100%; border-collapse: collapse; margin: 1em 0; }
                  td, th { border: 1px solid #ddd; padding: 8px; }
                `,
                
                // Tambahan konfigurasi lainnya tetap sama
                branding: false,
                statusbar: false,
                resize: false,
                paste_data_images: true,
                contextmenu: 'link image table',
                quickbars_selection_toolbar: 'bold italic underline | forecolor backcolor',
              }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white border-t border-gray-300 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
          <div>
            Tags: <span className="text-green-600 font-bold">Template (Hijau)</span> &bull; <span className="text-red-600 font-bold">Custom (Merah)</span>
          </div>
          <div>
            {value.length} karakter
          </div>
        </div>
      </div>

      {/* Modal Custom Tag (Red) */}
      {pendingTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tambah Tag Custom</h3>
              <button
                onClick={() => { setPendingTag(null); setCustomValue(""); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Masukkan nama tag variabel (akan berwarna merah).
            </p>
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="cth: total_harga"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCustomValueSubmit()}
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setPendingTag(null); setCustomValue(""); }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleCustomValueSubmit}
                disabled={!customValue.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sisipkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}