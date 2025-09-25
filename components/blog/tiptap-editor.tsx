"use client"

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function TipTapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    }
  })

  useEffect(() => {
    if (!editor) return
    // When parent content changes (e.g., cleared after save), update editor
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>')
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="tiptap-editor">
      <div className="flex gap-2 mb-3">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">1. List</button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="px-2 py-1 border rounded">Undo</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="px-2 py-1 border rounded">Redo</button>
      </div>
      <div className="border rounded p-2 bg-white dark:bg-gray-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
