import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableFooter } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { supabase } from "@/lib/supabase-client";
import { toast } from "@/components/ui/use-toast";

const STUDY_LEVELS = ["Undergraduate", "Master", "PhD"];
const STATUSES = ["Watchlist", "Applied", "Accepted", "Rejected", "Waitlisted"];

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
}

export function UniversityApplicationTracker({ userId }: { userId: string }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<any | null>(null);
  const [form, setForm] = useState({
    university_name: "",
    study_level: "Undergraduate",
    status: "Watchlist",
    application_deadline: "",
    submission_date: "",
    notes: ""
  });
  const [sortBy, setSortBy] = useState<string>("application_deadline");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Fetch applications
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from("university_applications")
      .select("*")
      .eq("user_id", userId)
      .order(sortBy, { ascending: sortDir === "asc" })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Error", description: "Failed to load applications", variant: "destructive" });
        } else {
          setApplications(data || []);
        }
        setLoading(false);
      });
  }, [userId, sortBy, sortDir]);

  // Filtering and pagination
  const filtered = applications.filter(app =>
    app.university_name.toLowerCase().includes(filter.toLowerCase()) ||
    app.study_level.toLowerCase().includes(filter.toLowerCase()) ||
    app.status.toLowerCase().includes(filter.toLowerCase()) ||
    (app.notes || "").toLowerCase().includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handle form changes
  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Handle add/edit
  function openAddModal() {
    setEditingApp(null);
    setForm({
      university_name: "",
      study_level: "Undergraduate",
      status: "Watchlist",
      application_deadline: "",
      submission_date: "",
      notes: ""
    });
    setShowModal(true);
  }
  function openEditModal(app: any) {
    setEditingApp(app);
    setForm({
      university_name: app.university_name,
      study_level: app.study_level,
      status: app.status,
      application_deadline: app.application_deadline || "",
      submission_date: app.submission_date || "",
      notes: app.notes || ""
    });
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setEditingApp(null);
  }

  // CRUD operations
  async function handleSave() {
    if (!form.university_name.trim() || !form.study_level || !form.status) {
      toast({ title: "Validation Error", description: "University Name, Study Level, and Status are required.", variant: "destructive" });
      return;
    }
    const payload = {
      user_id: userId,
      university_name: form.university_name,
      study_level: form.study_level,
      status: form.status,
      application_deadline: form.application_deadline || null,
      submission_date: form.submission_date || null,
      notes: form.notes
    };
    let result;
    if (editingApp) {
      result = await supabase.from("university_applications").update(payload).eq("id", editingApp.id);
    } else {
      result = await supabase.from("university_applications").insert([payload]);
    }
    if (result.error) {
      toast({ title: "Error", description: result.error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: editingApp ? "Application updated." : "Application added." });
      setShowModal(false);
      setEditingApp(null);
      // Refresh
      const { data } = await supabase.from("university_applications").select("*").eq("user_id", userId).order(sortBy, { ascending: sortDir === "asc" });
      setApplications(data || []);
    }
  }
  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    const { error } = await supabase.from("university_applications").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setApplications(applications.filter(app => app.id !== id));
      toast({ title: "Deleted", description: "Application deleted." });
    }
  }

  // Table column headers for sorting
  function renderHeader(label: string, key: string) {
    return (
      <th
        className="cursor-pointer select-none px-2 py-2 text-left text-xs font-bold text-myanmar-maroon"
        onClick={() => {
          if (sortBy === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
          else setSortBy(key);
        }}
      >
        {label}
        {sortBy === key && (sortDir === "asc" ? " ▲" : " ▼")}
      </th>
    );
  }

  // Main render
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <Input
          placeholder="Filter by any field..."
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
        <Button onClick={openAddModal} className="bg-myanmar-gold text-myanmar-maroon font-bold px-6 py-2 rounded-full shadow hover:bg-myanmar-gold/90 transition-all w-full md:w-auto mt-2 md:mt-0">
          Add Application
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-myanmar-gold/30 bg-white/80">
        <table className="min-w-full divide-y divide-myanmar-gold/20">
          <thead className="bg-myanmar-gold/10">
            <tr>
              {renderHeader("University Name", "university_name")}
              {renderHeader("Study Level", "study_level")}
              {renderHeader("Status", "status")}
              {renderHeader("Application Deadline", "application_deadline")}
              {renderHeader("Submission Date", "submission_date")}
              <th className="px-2 py-2 text-left text-xs font-bold text-myanmar-maroon">Notes</th>
              <th className="px-2 py-2 text-left text-xs font-bold text-myanmar-maroon">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No applications found.</td></tr>
            ) : (
              paginated.map(app => (
                <tr key={app.id} className="hover:bg-myanmar-gold/10 transition-colors">
                  <td className="px-2 py-2 text-myanmar-maroon font-medium">{app.university_name}</td>
                  <td className="px-2 py-2">{app.study_level}</td>
                  <td className="px-2 py-2">{app.status}</td>
                  <td className="px-2 py-2">{formatDate(app.application_deadline)}</td>
                  <td className="px-2 py-2">{formatDate(app.submission_date)}</td>
                  <td className="px-2 py-2 max-w-xs truncate" title={app.notes}>{app.notes}</td>
                  <td className="px-2 py-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(app)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(app.id)}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={e => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <Dialog open={showModal} onOpenChange={v => { if (!v) closeModal(); }}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>{editingApp ? "Edit Application" : "Add Application"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => { e.preventDefault(); handleSave(); }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>University Name *</Label>
              <Input
                name="university_name"
                value={form.university_name}
                onChange={handleFormChange}
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label>Study Level *</Label>
              <select
                name="study_level"
                value={form.study_level}
                onChange={handleFormChange}
                required
                className="w-full border rounded px-2 py-2"
              >
                {STUDY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                required
                className="w-full border rounded px-2 py-2"
              >
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Application Deadline</Label>
              <Input
                name="application_deadline"
                type="date"
                value={form.application_deadline || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Submission Date</Label>
              <Input
                name="submission_date"
                type="date"
                value={form.submission_date || ""}
                onChange={handleFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                rows={3}
                maxLength={500}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" className="bg-myanmar-gold text-myanmar-maroon font-bold">{editingApp ? "Save Changes" : "Add Application"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UniversityApplicationTracker;
