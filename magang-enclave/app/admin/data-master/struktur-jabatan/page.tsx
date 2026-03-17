"use client";

import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/app/components/sidebar-admin";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
  Handle,
  useNodesState,
  useEdgesState,
  Position as ReactFlowPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, Edit2, Trash2, MoreVertical, X, Menu } from "lucide-react";
import dagre from "dagre";

/* ================= INI TYPES ================= */

interface StrukturJabatan {
  id: number;
  name: string;
  position_name: string;
  division_name?: string;
  department_name?: string;
  parent_id: number | null;
  user_id: number;
  position_id: number;
  division_id?: number;
  department_id?: number;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  position_id?: number;
  division_id?: number;
  department_id?: number;
}

interface Position {
  id: number;
  name: string;
  level: string;
}

interface Division {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  division_id: number;
}

/* ================= INI CUSTOM NODE ================= */

const CustomNode = ({ data }: any) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative">
      <Handle type="target" position={ReactFlowPosition.Top} className="w-3 h-3 !bg-slate-400" />
      <div className="bg-white border-2 border-gray-300 rounded-lg px-3 py-2.5 shadow-md hover:shadow-lg transition w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {data.name.charAt(0).toUpperCase()}
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 flex-shrink-0"
          >
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="font-bold text-sm mb-1 truncate" title={data.name}>
          {data.name}
        </div>

        <div className="text-xs text-gray-700 mb-1 truncate" title={data.position}>
          {data.position}
        </div>

        {data.unit && (
          <div className="text-xs text-gray-500 truncate" title={data.unit}>
            {data.unit}
          </div>
        )}

        {showMenu && (
          <div className="absolute top-10 right-0 bg-white border rounded-lg shadow-xl z-50 w-32">
            <button
              onClick={() => {
                data.onEdit(data.nodeId);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-xs"
            >
              <Edit2 size={12} />
              Edit
            </button>
            <button
              onClick={() => {
                data.onDelete(data.nodeId);
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-xs border-t"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        )}
      </div>
      <Handle type="source" position={ReactFlowPosition.Bottom} className="w-3 h-3 !bg-slate-400" 
      />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

/* ================= INI LAYOUT FUNCTION ================= */

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "TB",
    nodesep: 80,
    ranksep: 100,
    align: "UL",
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 100,
        y: nodeWithPosition.y - 50,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

/* ================= INI PAGE ================= */

export default function StrukturJabatanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [data, setData] = useState<StrukturJabatan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    position_id: "",
    division_id: "",
    department_id: "",
    parent_id: "",
  });
  
  /* ================= INI FETCH ================= */

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchData(),
      fetchUsers(),
      fetchPositions(),
      fetchDivisions(),
      fetchDepartments(),
    ]);
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/organization-structure", {
        credentials: "include",
      });
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error("Fetch structure error:", err);
      alert("Gagal memuat struktur organisasi");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
      });
      const json = await res.json();
      setUsers(json.users || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await fetch("/api/admin/positions", {
        credentials: "include",
      });
      const json = await res.json();
      setPositions(json.positions || []);
    } catch (err) {
      console.error("Fetch positions error:", err);
    }
  };

  const fetchDivisions = async () => {
    try {
      const res = await fetch("/api/admin/divisions", {
        credentials: "include",
      });
      const json = await res.json();
      setDivisions(json.divisions || []);
    } catch (err) {
      console.error("Fetch divisions error:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/admin/departments", {
        credentials: "include",
      });
      const json = await res.json();
      setDepartments(json.departments || []);
    } catch (err) {
      console.error("Fetch departments error:", err);
    }
  };

  /* ================= NGE-BUILD GRAPH ================= */

  useEffect(() => {
    if (data.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const builtNodes: Node[] = [];
    const builtEdges: Edge[] = [];

    // ================= NGE-Build nodes =================

    data.forEach((item) => {
      let displayUnit = "";
      if (item.department_name) {
        displayUnit = item.department_name.length > 25 
          ? item.department_name.substring(0, 25) + "..." 
          : item.department_name;
      } else if (item.division_name) {
        displayUnit = item.division_name.length > 25 
          ? item.division_name.substring(0, 25) + "..." 
          : item.division_name;
      }

      builtNodes.push({
        id: item.id.toString(),
        type: "custom",
        position: { x: 0, y: 0 },
        data: {
          nodeId: item.id,
          name: item.name,
          position: item.position_name,
          unit: displayUnit,
          onEdit: handleEditClick,
          onDelete: handleDeleteClick,
        },
      });
    });

    // ================= NGE-Build edges =================
    const nodeIds = new Set(builtNodes.map(n => n.id));

    data.forEach((item) => {
      if (item.parent_id) {
        const sourceId = item.parent_id.toString();
        const targetId = item.id.toString();

        if (nodeIds.has(sourceId) && nodeIds.has(targetId)) {
          builtEdges.push({
            id: `e-${sourceId}-${targetId}`,
            source: sourceId,
            target: targetId,
            type: "smoothstep",
            style: { stroke: "#94a3b8", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#94a3b8",
            },
          });
        }
      }
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } =
      getLayoutedElements(builtNodes, builtEdges);

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [data]);

  /* ================= INI HANDLERS ================= */

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      user_id: "",
      position_id: "",
      division_id: "",
      department_id: "",
      parent_id: "",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = useCallback((id: number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;

    setEditingId(id);
    setFormData({
      user_id: item.user_id.toString(),
      position_id: item.position_id.toString(),
      division_id: item.division_id?.toString() || "",
      department_id: item.department_id?.toString() || "",
      parent_id: item.parent_id?.toString() || "",
    });
    setIsFormOpen(true);
  }, [data]);

  const handleDeleteClick = useCallback((id: number) => {
    const hasChildren = data.some((d) => d.parent_id === id);
    if (hasChildren) {
      alert("Tidak bisa menghapus node yang masih memiliki bawahan!");
      return;
    }

    setDeletingId(id);
    setIsDeleteModalOpen(true);
  }, [data]);

  const handleUserChange = (userId: string) => {
    const selectedUser = users.find((u) => u.id === Number(userId));

    if (selectedUser) {
      setFormData({
        user_id: userId,
        position_id: selectedUser.position_id?.toString() || "",
        division_id: selectedUser.division_id?.toString() || "",
        department_id: selectedUser.department_id?.toString() || "",
        parent_id: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isDuplicateUser = data.some(
        (d) => d.user_id === Number(formData.user_id) && d.id !== editingId
      );

      if (isDuplicateUser) {
        alert("Pegawai ini sudah ada di struktur organisasi!");
        setSubmitting(false);
        return;
      }

      const url = editingId
        ? `/api/admin/organization-structure/${editingId}`
        : "/api/admin/organization-structure";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(formData.user_id),
          position_id: Number(formData.position_id),
          division_id: formData.division_id ? Number(formData.division_id) : null,
          department_id: formData.department_id ? Number(formData.department_id) : null,
          parent_id: formData.parent_id ? Number(formData.parent_id) : null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal menyimpan data");
      }

      setIsFormOpen(false);
      setTimeout(() => fetchData(), 300);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/organization-structure/${deletingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setTimeout(() => fetchData(), 300);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDepartments = departments.filter(
    (dept) => !formData.division_id || dept.division_id === Number(formData.division_id)
  );

  const availableUsers = users.filter((user) => {
    if (editingId) {
      const currentNode = data.find((d) => d.id === editingId);
      if (currentNode && currentNode.user_id === user.id) return true;
    }
    return !data.some((d) => d.user_id === user.id);
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-[269px]" : "lg:ml-0"}`}>
          <div className="px-6 lg:px-10 py-10">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
              <div className="bg-white rounded-xl border h-[600px] flex items-center justify-center">
                <div className="text-gray-400">Memuat struktur...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-[269px]" : "lg:ml-0"}`}>
        <div className="px-6 lg:px-10 py-10">
          <div className="sticky top-0 z-30 bg-gray-50 py-4 px-6 lg:px-10 -mx-6 lg:-mx-10 mb-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-semibold">Struktur Organisasi</h1>
            <button onClick={handleAddClick} className="flex items-center gap-2 bg-[#4180a9] text-white px-4 py-2 rounded-lg hover:bg-[#356a8a] transition">
              <Plus size={18} />
              Tambah
            </button>
          </div>

          <div className="bg-white rounded-xl border h-[600px]">
            {nodes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Belum ada struktur organisasi. Klik Tambah untuk memulai.
              </div>
            ) : (
              <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes} 
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.3}
                maxZoom={2}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
                panOnDrag={true}
                zoomOnScroll={true}
                defaultEdgeOptions={{
                type: 'default',              
                style: {
                  stroke: '#000000',          
                  strokeWidth: 3,            
                },
              }}
              >
                <Background color="#d1d5db" gap={20} size={1} />
                <Controls showInteractive={false} position="bottom-right" />
              </ReactFlow>
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">{editingId ? "Edit" : "Tambah"} Struktur</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Pegawai <span className="text-red-500">*</span></label>
                <select required className="w-full border rounded px-3 py-2" value={formData.user_id} onChange={(e) => handleUserChange(e.target.value)}>
                  <option value="">Pilih Pegawai</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.full_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Jabatan <span className="text-red-500">*</span></label>
                <select required className="w-full border rounded px-3 py-2" value={formData.position_id} onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}>
                  <option value="">Pilih Jabatan</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Divisi</label>
                <select className="w-full border rounded px-3 py-2" value={formData.division_id} onChange={(e) => setFormData({ ...formData, division_id: e.target.value, department_id: "" })}>
                  <option value="">Pilih Divisi</option>
                  {divisions.map((div) => (
                    <option key={div.id} value={div.id}>{div.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Departemen</label>
                <select className="w-full border rounded px-3 py-2" value={formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: e.target.value })} disabled={!formData.division_id}>
                  <option value="">Pilih Departemen</option>
                  {filteredDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                {!formData.division_id && <p className="text-xs text-gray-400 mt-1">Pilih divisi terlebih dahulu</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Atasan</label>
                <select className="w-full border rounded px-3 py-2" value={formData.parent_id} onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}>
                  <option value="">Pimpinan Tertinggi</option>
                  {data.filter((d) => d.id !== editingId).map((d) => (
                    <option key={d.id} value={d.id}>{d.name} – {d.position_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 border rounded py-2 hover:bg-gray-50" disabled={submitting}>Batal</button>
                <button type="submit" className="flex-1 bg-[#4180a9] text-white rounded py-2 hover:bg-[#356a8a] disabled:opacity-50" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="font-semibold text-lg mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">Yakin ingin menghapus node ini dari struktur organisasi?</p>
            <div className="flex gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 border rounded py-2 hover:bg-gray-50" disabled={submitting}>Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-600 text-white rounded py-2 hover:bg-red-700 disabled:opacity-50" disabled={submitting}>
                {submitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}