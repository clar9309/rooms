export default function getStatusColor(status: string) {
  let color;
  switch (status) {
    case "Available":
      color = "bg-success";
      break;
    case "Busy":
      color = "bg-warning";
      break;
    case "Away":
      color = "bg-info";
      break;
    default:
      color = "bg-success";
  }
  return color;
}
