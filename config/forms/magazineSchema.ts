import {FormSchema} from "~/@types/FormSchema";

export default function (formContext: any): FormSchema[] {
  return [
    {
      cols: {
        title: {
          label: "magazine.title",
          validations: {
            required: {}
          }
        }
      }
    },
    {
      cols: {
        pdfFile: {
          label: "magazine.pdfFile",
          component: "file-uploader",
          accept: ".pdf",
          files: formContext?.magazine?.file ? [formContext.magazine.file] : [],
          canCancel: false,
          validations: {
            required: {}
          }
        }
      }
    },
    {
      cols: {
        coverFile: {
          label: "magazine.coverFile",
          component: "file-uploader",
          accept: "image/*",
          files: formContext?.magazine?.coverFile ? [formContext.magazine.coverFile] : [],
          canCancel: false,
          validations: {
            required: {}
          }
        }
      }
    },
    {
      cols: {
        publicationDate: {
          label: "magazine.publicationDate",
          component: "date-picker",
          type: "month",
          startByYear: false,
          validations: {
            required: {}
          }
        }
      }
    },
    {
      cols: {
        showRange: {
          label: "magazine.showRange",
          component: "date-picker-range",
          range: true,
          validations: {
            required: {}
          }
        }
      }
    },
  ]
}
