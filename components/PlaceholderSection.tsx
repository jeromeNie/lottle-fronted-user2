export function PlaceholderSection({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <div className="white-box mt10" id={id}>
      <div className="section-title">{title}</div>
      <p className="section-note">
        本区块版式已与参考站对齐；具体表格数据可按业务接入接口后替换。
      </p>
    </div>
  );
}
