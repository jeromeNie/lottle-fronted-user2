import type { IssueBlock } from "@/data/predictionBlocks";

function renderLine(line: IssueBlock["lines"][number], key: string) {
  if (line.kind === "zodiac") {
    return (
      <tr key={key}>
        <td className="pred-row" style={{ textAlign: "left" }}>
          <b>
            <span className="pred-label">{line.label}</span>
            <span className="pred-zodiac">
              {line.parts.map((p, i) => (
                <span key={i}>
                  {p.hit ? (
                    <span className="pred-hit">{p.ch}</span>
                  ) : (
                    p.ch
                  )}
                </span>
              ))}
            </span>
          </b>
        </td>
      </tr>
    );
  }
  return (
      <tr key={key}>
        <td
          className="pred-row"
          style={{ textAlign: "left", backgroundColor: "#fff" }}
        >
        <b>
          <span className="pred-label">{line.label}</span>
          <span className="pred-nums">
            {line.nums.map((n, i) => (
              <span key={i}>
                {i > 0 ? "\u00a0" : null}
                {n.hit ? <span className="pred-hit">{n.t}</span> : n.t}
              </span>
            ))}
          </span>
        </b>
      </td>
    </tr>
  );
}

export function IssueTables({ blocks }: { blocks: IssueBlock[] }) {
  return (
    <>
      {blocks.map((b) => (
        <table
          key={b.issue}
          className="pred-table"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          border={0}
        >
          <tbody>
            <tr>
              <td className="pred-head" style={{ height: 32 }}>
                <h2 className="pred-headText" style={{ textAlign: "left" }}>
                  {b.title}
                </h2>
              </td>
            </tr>
            {b.lines.map((line, i) => renderLine(line, `${b.issue}-${i}`))}
          </tbody>
        </table>
      ))}
    </>
  );
}
