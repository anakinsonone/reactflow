import { DragEvent, useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  Panel,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import axios from "axios";
import Modal from "./components/Modal";
import Sidebar from "./components/Sidebar";
import toast, { Toaster } from "react-hot-toast";

let id = 0;
const getId = () => `dndnode_${id++}`;

const DNDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showPortal, setShowPortal] = useState(false);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.Arrow,
            },
          },
          eds,
        ),
      ),
    [],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      axios
        .post("http://localhost:8000/api/workflows", { flow })
        .then((res) => console.log(res.data));
    }
  }, [reactFlowInstance]);

  const hidePortal = () => {
    setShowPortal(!showPortal);
  };

  const successToast = () => {
    toast.success("Workflow Executed!", { duration: 4000 });
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <Toaster />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background />
            <Panel position="top-right" style={{ display: "flex", gap: 10 }}>
              <button onClick={onSave}>Save Workflow</button>
              <button onClick={() => setShowPortal(true)}>Run Workflow</button>
            </Panel>
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
      <Modal
        successToast={successToast}
        showPortal={showPortal}
        hidePortal={hidePortal}
      />
    </div>
  );
};

export default DNDFlow;
