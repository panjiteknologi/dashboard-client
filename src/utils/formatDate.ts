import moment from "moment";

export function formatDateTime(value: string) {
  return value ? moment(value)?.format("DD MMMM YYYY HH:mm:ss") : "-";
}
