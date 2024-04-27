const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed("move");
  };

  return (
    <aside>
      <div className="description">Workflow Nodes</div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "Start")}
        draggable
      >
        Start
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "Filter Data")}
        draggable
      >
        Filter Data
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "Wait")}
        draggable
      >
        Wait
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "Convert Format")}
        draggable
      >
        Convert Format
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "Send POST Request")}
        draggable
      >
        Send POST Request
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "End")}
        draggable
      >
        End
      </div>
    </aside>
  );
};

export default Sidebar;
