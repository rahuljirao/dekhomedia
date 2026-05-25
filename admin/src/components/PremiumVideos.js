import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import axios from "axios";

// ── Theme constants ──────────────────────────────────────────────────────────
const PINK    = "#E91E8C";
const PINK_LT = "#FCE4F3";
const PINK_DK = "#C2185B";
const BLK     = "#0D0D0D";
const CARD_BG = "#1A1A1A";
const BORDER  = "#2E2E2E";
const WHITE   = "#FFFFFF";
const GRAY    = "#888";

const API = process.env.REACT_APP_API_URL;
const token = () => localStorage.getItem("token");

const s = {
    page:      { background: BLK,    minHeight: "100vh", padding: "0 0 40px 0", color: WHITE },
    topBar:    { display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:24 },
    h1:        { fontSize:20, fontWeight:700, color:WHITE, margin:0 },
    sub:       { fontSize:12, color:GRAY, marginTop:2 },
    addBtn:    { background: `linear-gradient(135deg,${PINK},${PINK_DK})`, color:WHITE, border:"none", borderRadius:10, padding:"10px 22px", fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:`0 4px 18px ${PINK}55` },
    // stats
    statsRow:  { display:"flex", flexWrap:"wrap", gap:14, marginBottom:24 },
    statCard:  { background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:12, padding:"14px 20px", minWidth:120 },
    statVal:   { fontSize:26, fontWeight:800 },
    statLbl:   { fontSize:11, color:GRAY, marginTop:2 },
    // filter bar
    filterBar: { display:"flex", flexWrap:"wrap", gap:10, marginBottom:18, alignItems:"center" },
    searchBox: { background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 14px", color:WHITE, fontSize:13, outline:"none", flex:1, minWidth:180 },
    filterSel: { background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", color:WHITE, fontSize:13, outline:"none" },
    // table card
    tableCard: { background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:14, overflow:"hidden" },
    th:        { background:"#111", padding:"12px 14px", fontSize:11, fontWeight:700, color:GRAY, textTransform:"uppercase", letterSpacing:0.6, whiteSpace:"nowrap", borderBottom:`1px solid ${BORDER}` },
    td:        { padding:"12px 14px", fontSize:13, borderBottom:`1px solid ${BORDER}`, verticalAlign:"middle" },
    // badges
    badgeRec:  { background:"#1B3A1B", color:"#4CAF50", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" },
    badgeNo:   { background:"#2B1B1B", color:"#888",    borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" },
    badgePrem: { background:`${PINK}22`, color:PINK, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 },
    badgeNorm: { background:"#1A2B3A", color:"#64B5F6", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 },
    // action buttons
    btnEdit:   { background:"transparent", border:`1px solid ${PINK}`, color:PINK, borderRadius:6, padding:"5px 12px", fontSize:12, cursor:"pointer", fontWeight:600 },
    btnDel:    { background:"transparent", border:"1px solid #EF5350", color:"#EF5350", borderRadius:6, padding:"5px 12px", fontSize:12, cursor:"pointer", fontWeight:600 },
    // toggle switch (inline CSS)
    toggleWrap:{ display:"flex", alignItems:"center", gap:6 },
    // modal overlay
    overlay:   { position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9998, display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
    modal:     { background:CARD_BG, border:`1px solid ${BORDER}`, borderRadius:16, width:"100%", maxWidth:640, maxHeight:"90vh", overflowY:"auto", boxShadow:`0 0 60px ${PINK}33` },
    modalHead: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", borderBottom:`1px solid ${BORDER}`, position:"sticky", top:0, background:CARD_BG, zIndex:1 },
    modalTitle:{ fontSize:16, fontWeight:700, color:WHITE },
    closeBtn:  { background:"transparent", border:"none", color:GRAY, fontSize:20, cursor:"pointer", lineHeight:1 },
    modalBody: { padding:"22px 24px" },
    // form
    fGroup:    { marginBottom:16 },
    label:     { display:"block", fontSize:11, fontWeight:700, color:GRAY, textTransform:"uppercase", letterSpacing:0.6, marginBottom:6 },
    input:     { width:"100%", background:"#111", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", color:WHITE, fontSize:13, outline:"none", boxSizing:"border-box" },
    textarea:  { width:"100%", background:"#111", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", color:WHITE, fontSize:13, outline:"none", boxSizing:"border-box", minHeight:90, resize:"vertical" },
    select:    { width:"100%", background:"#111", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", color:WHITE, fontSize:13, outline:"none", boxSizing:"border-box" },
    err:       { color:PINK, fontSize:11, marginTop:4 },
    // media upload
    mediaGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:12 },
    uploadBox: { background:"#111", border:`2px dashed ${BORDER}`, borderRadius:10, padding:"16px 10px", textAlign:"center", cursor:"pointer", transition:"border-color .2s" },
    uploadLbl: { fontSize:11, color:GRAY, marginTop:8, display:"block" },
    uploadPre: { width:"100%", height:80, objectFit:"cover", borderRadius:6, marginBottom:6 },
    // submit
    submitBtn: { width:"100%", background:`linear-gradient(135deg,${PINK},${PINK_DK})`, color:WHITE, border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", marginTop:4, boxShadow:`0 4px 20px ${PINK}55` },
    // recommended toggle (pink switch)
    switchTrackOn:  { width:40, height:22, borderRadius:11, background:PINK, display:"inline-flex", alignItems:"center", cursor:"pointer", transition:"background .2s", flexShrink:0 },
    switchTrackOff: { width:40, height:22, borderRadius:11, background:"#333", display:"inline-flex", alignItems:"center", cursor:"pointer", transition:"background .2s", flexShrink:0 },
    switchThumb:    { width:16, height:16, borderRadius:"50%", background:WHITE, boxShadow:"0 1px 4px rgba(0,0,0,.4)", transition:"transform .2s" },
};

const EMPTY_FORM = {
    id:0, title:"", description:"", category:"", tags:"",
    is_recommended:0, content_type:"normal",
    thumbnail_url:"", cover_video_url:"", poster_image_url:"",
    external_link:"", is_ad_enabled:1,
};

// ─── Helper: inline pink switch ──────────────────────────────────────────────
const PinkSwitch = ({ checked, onChange }) => (
    <div
        style={checked ? s.switchTrackOn : s.switchTrackOff}
        onClick={() => onChange(!checked)}
        role="switch" aria-checked={checked}
    >
        <span style={{ ...s.switchThumb, transform: checked ? "translateX(20px)" : "translateX(3px)" }} />
    </div>
);

// ─── Media upload box ─────────────────────────────────────────────────────────
const UploadBox = ({ label, accept, preview, onChange, icon }) => {
    const ref = useRef();
    return (
        <div
            style={{ ...s.uploadBox, borderColor: preview ? PINK : BORDER }}
            onClick={() => ref.current.click()}
        >
            {preview ? (
                accept.includes("video")
                    ? <video src={typeof preview === "string" ? preview : URL.createObjectURL(preview)} style={s.uploadPre} muted />
                    : <img src={typeof preview === "string" ? preview : URL.createObjectURL(preview)} alt="" style={s.uploadPre} />
            ) : (
                <div style={{ fontSize:28, color:GRAY }}>{icon}</div>
            )}
            <span style={s.uploadLbl}>{label}</span>
            <input ref={ref} type="file" accept={accept} style={{ display:"none" }} onChange={e => e.target.files[0] && onChange(e.target.files[0])} />
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const PremiumVideos = () => {
    const [data, setData]           = useState([]);
    const [total, setTotal]         = useState(0);
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit]       = useState(false);
    const [form, setForm]           = useState(EMPTY_FORM);
    const [files, setFiles]         = useState({ thumbnail:null, cover_video:null, poster_image:null });
    const [errors, setErrors]       = useState({});
    const [search, setSearch]       = useState("");
    const [ctFilter, setCtFilter]   = useState("");
    const [page, setPage]           = useState(1);
    const searchTimer               = useRef(null);

    // ── fetch ────────────────────────────────────────────────────────────────
    const fetchData = useCallback(async (q = search, ct = ctFilter, pg = page) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}admin/v1/premium-videos/list`, {
                params: { search:q, content_type:ct, page:pg, limit:20 },
                headers: { Authorization:`Bearer ${token()}` }
            });
            const d = res.data?.responseDetails;
            setData(d?.data || []);
            setTotal(d?.total || 0);
        } catch { toast.error("Failed to load videos"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── search debounce ───────────────────────────────────────────────────────
    const handleSearch = (v) => {
        setSearch(v);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => { setPage(1); fetchData(v, ctFilter, 1); }, 500);
    };

    const handleCtFilter = (v) => {
        setCtFilter(v); setPage(1); fetchData(search, v, 1);
    };

    // ── open modal ────────────────────────────────────────────────────────────
    const openAdd = () => {
        setForm(EMPTY_FORM);
        setFiles({ thumbnail:null, cover_video:null, poster_image:null });
        setErrors({});
        setIsEdit(false);
        setShowModal(true);
    };

    const openEdit = (row) => {
        setForm({ ...EMPTY_FORM, ...row });
        setFiles({ thumbnail:null, cover_video:null, poster_image:null });
        setErrors({});
        setIsEdit(true);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    // ── form change ───────────────────────────────────────────────────────────
    const fc = (key, val) => setForm(p => ({ ...p, [key]: val }));

    // ── validate ──────────────────────────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "Title is required";
        if (!form.external_link.trim()) e.external_link = "External link is required";
        return e;
    };

    // ── submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k,v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
            if (files.thumbnail)    fd.append("thumbnail",    files.thumbnail);
            if (files.cover_video)  fd.append("cover_video",  files.cover_video);
            if (files.poster_image) fd.append("poster_image", files.poster_image);

            const url = isEdit
                ? `${API}admin/v1/premium-videos/update`
                : `${API}admin/v1/premium-videos/add`;

            const res = await axios.post(url, fd, {
                headers: { Authorization:`Bearer ${token()}`, "Content-Type":"multipart/form-data" }
            });
            toast.success(res.data?.responseMessage || "Saved!");
            closeModal();
            fetchData(search, ctFilter, page);
        } catch (err) {
            toast.error(err?.response?.data?.responseMessage || "Save failed");
        } finally { setSaving(false); }
    };

    // ── delete ────────────────────────────────────────────────────────────────
    const handleDelete = (row) => {
        Swal.fire({
            title: "Delete this video?",
            text: `"${row.title}" will be permanently removed.`,
            icon: "warning",
            background: CARD_BG,
            color: WHITE,
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            cancelButtonColor: PINK,
            confirmButtonText: "Yes, delete",
        }).then(async r => {
            if (!r.isConfirmed) return;
            try {
                await axios.post(`${API}admin/v1/premium-videos/delete`, { id:row.id }, { headers:{ Authorization:`Bearer ${token()}` } });
                setData(p => p.filter(x => x.id !== row.id));
                setTotal(t => t - 1);
                toast.success("Deleted");
            } catch { toast.error("Delete failed"); }
        });
    };

    // ── toggle recommended ────────────────────────────────────────────────────
    const handleToggleRecommended = async (row) => {
        const newVal = row.is_recommended ? 0 : 1;
        try {
            await axios.post(`${API}admin/v1/premium-videos/toggle-recommended`,
                { id:row.id, is_recommended:newVal },
                { headers:{ Authorization:`Bearer ${token()}` } }
            );
            setData(p => p.map(x => x.id === row.id ? { ...x, is_recommended:newVal } : x));
        } catch { toast.error("Update failed"); }
    };

    // ── toggle active ─────────────────────────────────────────────────────────
    const handleToggleActive = async (row) => {
        const newVal = row.is_active ? 0 : 1;
        try {
            await axios.post(`${API}admin/v1/premium-videos/toggle-active`,
                { id:row.id, is_active:newVal },
                { headers:{ Authorization:`Bearer ${token()}` } }
            );
            setData(p => p.map(x => x.id === row.id ? { ...x, is_active:newVal } : x));
        } catch { toast.error("Update failed"); }
    };

    // ── stats ─────────────────────────────────────────────────────────────────
    const recommended = data.filter(d => d.is_recommended).length;
    const premium     = data.filter(d => d.content_type === "premium").length;
    const normal      = data.filter(d => d.content_type === "normal").length;

    // ── render ────────────────────────────────────────────────────────────────
    return (
        <div style={s.page}>

            {/* Top bar */}
            <div style={s.topBar}>
                <div>
                    <div style={s.h1}>
                        <span style={{ color:PINK }}>◆</span> Premium Videos
                    </div>
                    <div style={s.sub}>Manage content for Normal & Premium users · {total} total</div>
                </div>
                <button style={s.addBtn} onClick={openAdd}>
                    <span style={{ fontSize:16 }}>＋</span> Add Video
                </button>
            </div>

            {/* Stats */}
            <div style={s.statsRow}>
                {[
                    { label:"Total Videos",   val:total,       color:WHITE },
                    { label:"⭐ Recommended", val:recommended,  color:PINK },
                    { label:"★ Premium",      val:premium,      color:"#CE93D8" },
                    { label:"◎ Normal",        val:normal,       color:"#64B5F6" },
                ].map(c => (
                    <div key={c.label} style={s.statCard}>
                        <div style={{ ...s.statVal, color:c.color }}>{c.val}</div>
                        <div style={s.statLbl}>{c.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter bar */}
            <div style={s.filterBar}>
                <input
                    style={s.searchBox}
                    placeholder="🔍  Search title, category, tags..."
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                />
                <select style={s.filterSel} value={ctFilter} onChange={e => handleCtFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="normal">Normal (Short Drama)</option>
                    <option value="premium">Premium (Uncut)</option>
                </select>
            </div>

            {/* Table */}
            <div style={s.tableCard}>
                {loading ? (
                    <div style={{ padding:40, textAlign:"center", color:GRAY }}>
                        <div style={{ width:28, height:28, border:`3px solid ${PINK}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto" }} />
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                        <div style={{ marginTop:10, fontSize:12 }}>Loading videos...</div>
                    </div>
                ) : data.length === 0 ? (
                    <div style={{ padding:50, textAlign:"center", color:GRAY }}>
                        <div style={{ fontSize:36 }}>🎬</div>
                        <div style={{ marginTop:10 }}>No videos found. Add one!</div>
                    </div>
                ) : (
                    <div style={{ overflowX:"auto" }}>
                        <table style={{ width:"100%", borderCollapse:"collapse" }}>
                            <thead>
                                <tr>
                                    {["#","Thumbnail","Title / Tags","Type","Recommended","Active","Ad","Added","Actions"].map(h => (
                                        <th key={h} style={s.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, idx) => (
                                    <tr key={row.id} style={{ background: idx % 2 === 0 ? "transparent" : "#151515" }}>

                                        {/* # */}
                                        <td style={{ ...s.td, color:GRAY, width:40 }}>{idx+1}</td>

                                        {/* Thumbnail */}
                                        <td style={{ ...s.td, width:60 }}>
                                            {row.thumbnail_url
                                                ? <img src={row.thumbnail_url} alt=""
                                                    style={{ width:54, height:54, objectFit:"cover", borderRadius:8, border:`1px solid ${BORDER}` }}
                                                    onError={e => { e.target.style.display="none"; }}
                                                  />
                                                : <div style={{ width:54, height:54, background:"#222", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎬</div>
                                            }
                                        </td>

                                        {/* Title + tags */}
                                        <td style={{ ...s.td, maxWidth:220 }}>
                                            <div style={{ fontWeight:600, marginBottom:3, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                                                {row.title}
                                            </div>
                                            {row.tags && (
                                                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                                                    {row.tags.split(",").slice(0,3).map(t => (
                                                        <span key={t} style={{ background:`${PINK}22`, color:PINK, borderRadius:4, padding:"1px 6px", fontSize:10 }}>
                                                            {t.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {row.category && <div style={{ fontSize:10, color:GRAY, marginTop:2 }}>📂 {row.category}</div>}
                                        </td>

                                        {/* Content type */}
                                        <td style={s.td}>
                                            <span style={row.content_type === "premium" ? s.badgePrem : s.badgeNorm}>
                                                {row.content_type === "premium" ? "★ Premium" : "◎ Normal"}
                                            </span>
                                        </td>

                                        {/* Recommended toggle */}
                                        <td style={s.td}>
                                            <div style={s.toggleWrap}>
                                                <PinkSwitch
                                                    checked={row.is_recommended === 1}
                                                    onChange={() => handleToggleRecommended(row)}
                                                />
                                                <span style={row.is_recommended ? s.badgeRec : s.badgeNo}>
                                                    {row.is_recommended ? "Yes" : "No"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Active toggle */}
                                        <td style={s.td}>
                                            <div style={{ ...s.toggleWrap }}>
                                                <div
                                                    onClick={() => handleToggleActive(row)}
                                                    style={{ width:36, height:20, borderRadius:10, background: row.is_active ? "#4CAF50" : "#555", cursor:"pointer", position:"relative", transition:"background .2s" }}>
                                                    <span style={{ position:"absolute", top:2, left: row.is_active ? 16 : 2, width:16, height:16, borderRadius:"50%", background:WHITE, transition:"left .2s" }} />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Ad enabled */}
                                        <td style={{ ...s.td, fontSize:16, textAlign:"center" }}>
                                            {row.is_ad_enabled ? "✅" : "❌"}
                                        </td>

                                        {/* Date */}
                                        <td style={{ ...s.td, fontSize:11, color:GRAY, whiteSpace:"nowrap" }}>
                                            {moment(row.created_at).format("DD MMM YY")}
                                        </td>

                                        {/* Actions */}
                                        <td style={s.td}>
                                            <div style={{ display:"flex", gap:6 }}>
                                                <button style={s.btnEdit} onClick={() => openEdit(row)}>✏️ Edit</button>
                                                <button style={s.btnDel}  onClick={() => handleDelete(row)}>🗑</button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {total > 20 && (
                            <div style={{ padding:"14px 20px", display:"flex", gap:8, justifyContent:"flex-end" }}>
                                {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i+1).map(pg => (
                                    <button
                                        key={pg}
                                        onClick={() => { setPage(pg); fetchData(search, ctFilter, pg); }}
                                        style={{ background: pg === page ? PINK : "transparent", color: pg === page ? WHITE : GRAY, border:`1px solid ${pg === page ? PINK : BORDER}`, borderRadius:6, padding:"5px 11px", cursor:"pointer", fontWeight: pg === page ? 700 : 400 }}
                                    >{pg}</button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Modal ───────────────────────────────────────────────────── */}
            {showModal && (
                <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
                    <div style={s.modal}>

                        {/* Modal header */}
                        <div style={s.modalHead}>
                            <div>
                                <div style={s.modalTitle}>
                                    <span style={{ color:PINK }}>◆</span> {isEdit ? "Edit" : "Add"} Video
                                </div>
                                <div style={{ fontSize:11, color:GRAY, marginTop:2 }}>
                                    {isEdit ? "Update video details and media" : "Upload new content to the platform"}
                                </div>
                            </div>
                            <button style={s.closeBtn} onClick={closeModal}>✕</button>
                        </div>

                        {/* Modal body */}
                        <div style={s.modalBody}>
                            <form onSubmit={handleSubmit}>

                                {/* Title */}
                                <div style={s.fGroup}>
                                    <label style={s.label}>Title <span style={{ color:PINK }}>*</span></label>
                                    <input style={{ ...s.input, borderColor: errors.title ? PINK : BORDER }} placeholder="Enter video title..." value={form.title} onChange={e => fc("title", e.target.value)} />
                                    {errors.title && <div style={s.err}>{errors.title}</div>}
                                </div>

                                {/* Description */}
                                <div style={s.fGroup}>
                                    <label style={s.label}>Description</label>
                                    <textarea style={s.textarea} placeholder="Full description..." value={form.description} onChange={e => fc("description", e.target.value)} />
                                </div>

                                {/* Category + Tags (2 col) */}
                                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                                    <div style={s.fGroup}>
                                        <label style={s.label}>Category</label>
                                        <input style={s.input} placeholder="e.g. Romance" value={form.category} onChange={e => fc("category", e.target.value)} />
                                    </div>
                                    <div style={s.fGroup}>
                                        <label style={s.label}>Tags <span style={{ color:GRAY, fontSize:10 }}>(comma sep.)</span></label>
                                        <input style={s.input} placeholder="e.g. Drama,Hot,New" value={form.tags} onChange={e => fc("tags", e.target.value)} />
                                    </div>
                                </div>

                                {/* ── Recommendation toggle ─────────────────── */}
                                <div style={{ ...s.fGroup, background:`${PINK}11`, border:`1px solid ${PINK}33`, borderRadius:10, padding:"14px 16px" }}>
                                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                        <div>
                                            <div style={{ fontWeight:700, fontSize:13, color:WHITE }}>
                                                ⭐ Recommended  <span style={{ background:`${PINK}22`, color:PINK, borderRadius:20, padding:"2px 8px", fontSize:10, marginLeft:6 }}>Powers 'For You'</span>
                                            </div>
                                            <div style={{ fontSize:11, color:GRAY, marginTop:3 }}>Enable to show this video in the 'For You' section</div>
                                        </div>
                                        <PinkSwitch
                                            checked={form.is_recommended === 1}
                                            onChange={v => fc("is_recommended", v ? 1 : 0)}
                                        />
                                    </div>
                                </div>

                                {/* Content type */}
                                <div style={s.fGroup}>
                                    <label style={s.label}>Content Type</label>
                                    <div style={{ display:"flex", gap:10 }}>
                                        {[
                                            { val:"normal",  icon:"◎", label:"Normal", sub:"Short Drama" },
                                            { val:"premium", icon:"★", label:"Premium", sub:"Uncut Content" },
                                        ].map(opt => (
                                            <label key={opt.val} style={{ flex:1, background: form.content_type === opt.val ? `${PINK}18` : "#111", border:`2px solid ${form.content_type === opt.val ? PINK : BORDER}`, borderRadius:10, padding:"12px 14px", cursor:"pointer", transition:"all .2s" }}>
                                                <input type="radio" name="content_type" value={opt.val} checked={form.content_type === opt.val} onChange={() => fc("content_type", opt.val)} style={{ display:"none" }} />
                                                <div style={{ fontWeight:700, color: form.content_type === opt.val ? PINK : WHITE, fontSize:14 }}>{opt.icon} {opt.label}</div>
                                                <div style={{ fontSize:11, color:GRAY, marginTop:2 }}>{opt.sub}</div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* ── Media uploads ──────────────────────────── */}
                                <div style={s.fGroup}>
                                    <label style={s.label}>Media Assets</label>
                                    <div style={s.mediaGrid}>
                                        <UploadBox
                                            label="Thumbnail (Grid Card)"
                                            accept="image/*"
                                            preview={files.thumbnail || form.thumbnail_url}
                                            icon="🖼"
                                            onChange={f => setFiles(p => ({ ...p, thumbnail:f }))}
                                        />
                                        <UploadBox
                                            label="Cover Video (Autoplay)"
                                            accept="video/*"
                                            preview={files.cover_video || form.cover_video_url}
                                            icon="🎬"
                                            onChange={f => setFiles(p => ({ ...p, cover_video:f }))}
                                        />
                                        <UploadBox
                                            label="Poster Image (Detail BG)"
                                            accept="image/*"
                                            preview={files.poster_image || form.poster_image_url}
                                            icon="🎭"
                                            onChange={f => setFiles(p => ({ ...p, poster_image:f }))}
                                        />
                                    </div>
                                    <div style={{ fontSize:10, color:GRAY, marginTop:6 }}>
                                        ↳ Uploads → <code>/uploads/thumbnails/</code> · <code>/uploads/videos/</code> · <code>/uploads/posters/</code>
                                    </div>
                                </div>

                                {/* External link */}
                                <div style={s.fGroup}>
                                    <label style={s.label}>External Destination Link <span style={{ color:PINK }}>*</span></label>
                                    <input
                                        style={{ ...s.input, borderColor: errors.external_link ? PINK : BORDER }}
                                        placeholder="https://example.com/video/..."
                                        value={form.external_link}
                                        onChange={e => fc("external_link", e.target.value)}
                                    />
                                    {errors.external_link && <div style={s.err}>{errors.external_link}</div>}
                                    <div style={{ fontSize:10, color:GRAY, marginTop:4 }}>🔒 Hidden from users — opens in external browser</div>
                                </div>

                                {/* Ad toggle */}
                                <div style={{ ...s.fGroup, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#111", border:`1px solid ${BORDER}`, borderRadius:10, padding:"12px 16px" }}>
                                    <div>
                                        <div style={{ fontWeight:600, fontSize:13 }}>Ads Enabled</div>
                                        <div style={{ fontSize:11, color:GRAY }}>Show ads before/during this video</div>
                                    </div>
                                    <div
                                        onClick={() => fc("is_ad_enabled", form.is_ad_enabled ? 0 : 1)}
                                        style={{ width:40, height:22, borderRadius:11, background: form.is_ad_enabled ? "#4CAF50" : "#555", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
                                        <span style={{ position:"absolute", top:3, left: form.is_ad_enabled ? 19 : 3, width:16, height:16, borderRadius:"50%", background:WHITE, transition:"left .2s" }} />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" style={s.submitBtn} disabled={saving}>
                                    {saving
                                        ? <span>⏳ Saving...</span>
                                        : <span>💾 {isEdit ? "Update Video" : "Add Video"}</span>
                                    }
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PremiumVideos;
