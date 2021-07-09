import {FormSchema} from "~/@types/FormSchema";

export default function (formContext: any): FormSchema[] {
  return [
    {
      cols: {
        title: {
          label: "magazine.title",
        }
      }
    },
    {
      cols: {
        pdfFile: {
          label: "magazine.pdfFile",
          component: "file-uploader",
          accept: ".pdf",
          files: formContext.magazine.file ? [formContext.magazine.file] : [],
          canCancel: false
        }
      }
    },
    {
      cols: {
        coverFile: {
          label: "magazine.coverFile",
          component: "file-uploader",
          accept: "image/*",
          files: formContext.magazine.coverFile ? [formContext.magazine.coverFile] : [],
          canCancel: false
        }
      }
    },
    {
      cols: {
        publicationDate: {
          label: "magazine.publicationDate",
          component: "date-picker",
          type: "month",
          startByYear: false
        }
      }
    },
    {
      cols: {
        showRange: {
          label: "magazine.showRange",
          component: "date-picker-range",
          range: true
        }
      }
    },
  ]
}
