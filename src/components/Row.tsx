import { classNames, pctColor } from "../util/helpers";

interface Props {
  row: any;
  selected: string | null;
  onSelect: (s: string) => void;
}

export default function Row({ row, selected, onSelect }: Props) {
  return (
    <tr
      key={row.symbol}
      className={classNames(
        "border-b hover:bg-blue-50/40 transition cursor-pointer",
        selected === row.symbol && "bg-blue-50"
      )}
      onClick={() => onSelect(row.symbol)}
      title="Click to toggle chart"
    >
      <td className="px-4 py-3 font-semibold">{row.symbol}</td>
      <td className="px-4 py-3 text-gray-700">{row.name || "—"}</td>
      <td className="px-4 py-3 tabular-nums">{Number(row.price).toFixed(2)}</td>
      <td className={classNames("px-4 py-3 tabular-nums font-medium", pctColor(row.changesPercentage))}>
        {row.changesPercentage !== undefined ? row.changesPercentage.toFixed(2) + "%" : "—"}
      </td>
    </tr>
  );
}