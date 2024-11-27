import { Pipe, PipeTransform } from "@angular/core";
import { format, parse } from "date-fns";

@Pipe({
  name: "startTime",
})
export class StartTimePipe implements PipeTransform {
  transform(value: string): string {
    const date = parse(value, "h:mm aa", new Date());
    return format(date, "HH:mm");
  }
}
