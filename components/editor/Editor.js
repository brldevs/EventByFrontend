import dynamic from "next/dynamic";
import { useState } from "react";
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    [{ align: [] }],
    ["bold", "italic", "underline"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],

    ["link"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
];

export default function Editor({ editorData, setEditorData }) {
  const countCharacters = (str) => {
    // str = str.replace(/(^\s*)|(\s*$)/gi, "");
    // str = str.replace(/[ ]{2,}/gi, " ");
    // str = str.replace(/\n /, "\n");
    // return str.split(" ").length;

    // use the \s quantifier to remove all white space
    let remText = str.replace(/\s/g, "");

    // get the length of the string after removal
    let length = remText.length;
    return length;
  };

  const [addDescription, setAddDescription] = useState(null);
  const handleChange = (content, delta, source, editor) => {
    setEditorData(editor.getHTML());
    // console.log("EDITOR: ")
    // console.log(editor.getHTML().replace(/(&nbsp;|<([^>]+)>)/ig, ''))
    // setAddDescription(editor.getHTML().replace(/(&nbsp;|<([^>]+)>)/gi, ""));

    setAddDescription(editor.getHTML());
  };
  return (
    <>
      <QuillNoSSRWrapper
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        value={editorData}
      />
      {addDescription && (
        <span className="text-secondary font-13">
          Total {countCharacters(addDescription.toString())} Characters
        </span>
      )}
    </>
  );
}

//  Total {countCharacters(addDescription.toString())} Characters
