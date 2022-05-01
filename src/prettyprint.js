export default function printToken(token, lastShift) {
   let element = document.createElement("p");
   element.style="margin-bottom: 0; font-size: 1.25em";
   let shift = getOrLast(token, lastShift);
   for(let ws = 0; ws <  shift * 5; ws++) {
      element.appendChild(document.createTextNode("\u00A0"));
   }
   element.appendChild(document.createTextNode(token));

   return {element: element, lastShift: shift};
}

function getOrLast(token, lastShift) {
    if (shift.has(token)) {
      return shift.get(token)
    } else {
      return lastShift;
    }
}

const shift = new Map(
    [
        ["<table>", 0],
        ["</table>", 0],
        ["<thead>", 1],
        ["</thead>", 1],
        ["<tbody>", 1],
        ["</tbody>", 1],
        ["<tfoot>", 1],
        ["</tfoot>", 1],
        ["<tr>", 2],
        ["</tr>", 2],
        ["<td>", 3],
        ["</td>", 3],
        ["<th>", 3],
        ["</th>", 3]
    ]
)