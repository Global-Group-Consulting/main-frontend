//import {TableSchema} from "~/@types/config/TableSchema";

/**
 * @type {Record<string, import("~/@types/config/TableSchema").TableSchema>}
 */
const schema = {
  'title': {
    text: 'tables.magazine.title',
    value: 'title',
    width: "20%"
  },
  'showRange': {
    text: 'tables.magazine.showRange',
    value: 'showRange',
    align: "center",
    width: "15%"
  },
  'publicationDate': {
    text: 'tables.magazine.publicationDate',
    value: 'publicationDate',
    align: "center",
    width: "15%"
  },

  'actions': {
    value: 'actions',
    sortable: false,
    align: 'center',
    width: '1%',
    component: "CellMagazineActions"
  }
}

export default schema
