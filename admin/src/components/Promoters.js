import React, { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from "moment";
import * as services from '../Services/services';
import Model from "./Model/Index";
import $ from 'jquery';

const DEEP_LINK_BASE = process.env.REACT_APP_DEEP_LINK_BASE || 'dekho://invite';
const WEB_INSTALL_BASE = process.env.REACT_APP_INSTALL_URL || 'https://play.google.com/store/apps/details?id=com.dekho.uncutvideos&referrer=slug%3D';

const emptyForm = { id: 0, name: '', custom_slug: '', allowed_content_type: 'normal' };

const Promoters = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModel, setShowModel] = useState({ show: false, title: 'Add' });
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [copiedId, setCopiedId] = useState(null);
    const nameRef = useRef(null);
    const slugRef = useRef(null);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await services.getPromotersList();
            setData(res?.data?.responseDetails || []);
        } catch {
            toast.error("Failed to load promoters");
        } finally {
            setLoading(false);
        }
    };

    const openModel = (title, rowData = null) => {
        setErrors({});
        setForm(rowData ? {
            id: rowData.id,
            name: rowData.name,
            custom_slug: rowData.custom_slug,
            allowed_content_type: rowData.allowed_content_type
        } : emptyForm);
        setShowModel({ show: true, title });
        $("body").addClass("no_scroll");
        $('.overlay').addClass('qv_active');
    };

    const closeModel = () => {
        setShowModel({ show: false, title: 'Add' });
        setErrors({});
        setForm(emptyForm);
        $("body").removeClass("no_scroll");
        $('.overlay').removeClass('qv_active');
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) { errs.name = "Name is required"; nameRef.current?.focus(); }
        else if (!form.custom_slug.trim()) { errs.custom_slug = "Slug is required"; slugRef.current?.focus(); }
        else if (!/^[a-zA-Z0-9_-]+$/.test(form.custom_slug)) { errs.custom_slug = "Slug: only letters, numbers, _ and - allowed"; slugRef.current?.focus(); }
        return errs;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSaving(true);
        try {
            if (form.id) {
                const res = await services.updatePromoter(form);
                toast.success(res?.data?.responseMessage || "Updated");
                setData(prev => prev.map(p => p.id === form.id ? { ...p, ...form } : p));
            } else {
                const res = await services.addPromoter(form);
                toast.success(res?.data?.responseMessage || "Added");
                fetchData();
            }
            closeModel();
        } catch (err) {
            toast.error(err?.response?.data?.responseMessage || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (row) => {
        Swal.fire({
            title: "Delete this promoter?",
            text: `"${row.name}" and their invite link will be permanently removed.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--first-color)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete",
            customClass: { confirmButton: 'btn', cancelButton: 'btn' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await services.deletePromoter({ id: row.id });
                    setData(prev => prev.filter(p => p.id !== row.id));
                    Swal.fire({ title: "Deleted!", icon: "success", customClass: { confirmButton: 'btn' } });
                } catch {
                    toast.error("Failed to delete");
                }
            }
        });
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(() => toast.error("Copy failed"));
    };

    const getPlayStoreLink = (slug) => `${WEB_INSTALL_BASE}${encodeURIComponent(slug)}`;
    const getDeepLink = (slug) => `${DEEP_LINK_BASE}/${slug}`;

    return (
        <>
            <div className='overlay'></div>

            <section id="promoters-section" className="section">
                {/* Header */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                    <div>
                        <h4 className="mb-1">Promoters</h4>
                        <p style={{ color: 'var(--text-muted, #888)', fontSize: '0.85rem', margin: 0 }}>
                            Generate invite links to give selected users access to premium content.
                        </p>
                    </div>
                    <button className="btn upgrade-btn add-notification-btn" onClick={() => openModel('Add')}>
                        <i className="fas fa-plus me-1"></i> Add Promoter
                    </button>
                </div>

                {/* Stats bar */}
                <div className="d-flex flex-wrap gap-3 mb-4">
                    <div className="card px-3 py-2" style={{ minWidth: 140 }}>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>Total</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{data.length}</div>
                    </div>
                    <div className="card px-3 py-2" style={{ minWidth: 140 }}>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>Normal Access</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4CAF50' }}>
                            {data.filter(d => d.allowed_content_type === 'normal').length}
                        </div>
                    </div>
                    <div className="card px-3 py-2" style={{ minWidth: 140 }}>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>Premium Access</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--first-color, #FF5733)' }}>
                            {data.filter(d => d.allowed_content_type === 'premium').length}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card">
                    <div className="card-body p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: 'var(--first-color)' }} role="status" />
                            </div>
                        ) : data.length === 0 ? (
                            <div className="text-center py-5" style={{ color: '#888' }}>
                                <i className="fas fa-link fa-2x mb-2 d-block" />
                                No promoters yet. Add one to get started.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped w-100 mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 50 }}>#</th>
                                            <th>Promoter Name</th>
                                            <th>Slug</th>
                                            <th>Content Type</th>
                                            <th>Install Link</th>
                                            <th>Created</th>
                                            <th style={{ width: 120 }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((row, idx) => {
                                            const playLink = getPlayStoreLink(row.custom_slug);
                                            const deepLink = getDeepLink(row.custom_slug);
                                            const isPremium = row.allowed_content_type === 'premium';
                                            return (
                                                <tr key={row.id}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <strong>{row.name}</strong>
                                                    </td>
                                                    <td>
                                                        <code style={{
                                                            background: 'var(--bg-light, #222)',
                                                            padding: '2px 8px',
                                                            borderRadius: 4,
                                                            fontSize: '0.85rem'
                                                        }}>
                                                            {row.custom_slug}
                                                        </code>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${isPremium ? 'bg-warning text-dark' : 'bg-success'}`}
                                                            style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: 20 }}>
                                                            {isPremium ? '⭐ Premium' : '✓ Normal'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-1">
                                                            {/* Play Store link */}
                                                            <div className="d-flex align-items-center gap-1">
                                                                <span style={{
                                                                    fontSize: '0.72rem', color: '#888',
                                                                    maxWidth: 220, overflow: 'hidden',
                                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                    display: 'inline-block'
                                                                }} title={playLink}>
                                                                    <i className="fab fa-google-play me-1" style={{ color: '#4CAF50' }} />
                                                                    {playLink.length > 40 ? playLink.slice(0, 40) + '…' : playLink}
                                                                </span>
                                                                <button
                                                                    className="btn btn-sm"
                                                                    style={{ padding: '1px 6px', fontSize: '0.7rem' }}
                                                                    title="Copy Play Store link"
                                                                    onClick={() => handleCopy(playLink, `play-${row.id}`)}>
                                                                    <i className={`fas ${copiedId === `play-${row.id}` ? 'fa-check text-success' : 'fa-copy'}`} />
                                                                </button>
                                                            </div>
                                                            {/* Deep link */}
                                                            <div className="d-flex align-items-center gap-1">
                                                                <span style={{
                                                                    fontSize: '0.72rem', color: '#888',
                                                                    maxWidth: 220, overflow: 'hidden',
                                                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                    display: 'inline-block'
                                                                }} title={deepLink}>
                                                                    <i className="fas fa-link me-1" style={{ color: '#2196F3' }} />
                                                                    {deepLink}
                                                                </span>
                                                                <button
                                                                    className="btn btn-sm"
                                                                    style={{ padding: '1px 6px', fontSize: '0.7rem' }}
                                                                    title="Copy deep link"
                                                                    onClick={() => handleCopy(deepLink, `deep-${row.id}`)}>
                                                                    <i className={`fas ${copiedId === `deep-${row.id}` ? 'fa-check text-success' : 'fa-copy'}`} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#888' }}>
                                                        {moment(row.created_at).format("DD MMM YYYY")}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-sm btn-edit" title="Edit"
                                                                onClick={() => openModel('Edit', row)}>
                                                                <i className="fas fa-edit" />
                                                            </button>
                                                            <button className="btn btn-sm btn-delete" title="Delete"
                                                                onClick={() => handleDelete(row)}>
                                                                <i className="fas fa-trash-alt" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Add / Edit Modal */}
            {showModel.show && (
                <Model className="common-popup edit-popup active">
                    <div className="edit-heading d-flex align-items-center justify-content-between">
                        <h3>{showModel.title} Promoter</h3>
                        <button className="common-close edit-close-btn" onClick={closeModel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
                                <path fill="#ffffff" d="M19.95 16.75l-.05-.4-1.2-1-5.2-4.2c-.1-.05-.3-.2-.6-.5l-.7-.55c-.15-.1-.5-.45-1-1.1l-.1-.1c.2-.15.4-.35.6-.55l1.95-1.85 1.1-1c1-1 1.7-1.65 2.1-1.9l.5-.35c.4-.25.65-.45.75-.45.2-.15.45-.35.65-.6s.3-.5.3-.7l-.3-.65c-.55.2-1.2.65-2.05 1.35-.85.75-1.65 1.55-2.5 2.5-.8.9-1.6 1.65-2.4 2.3-.8.65-1.4.95-1.9 1-.15 0-1.5-1.05-4.1-3.2C3.1 2.6 1.45 1.2.7.55L.45.1c-.1.05-.2.15-.3.3C.05.55 0 .7 0 .85l.05.35.05.4 1.2 1 5.2 4.15c.1.05.3.2.6.5l.7.6c.15.1.5.45 1 1.1l.1.1c-.2.15-.4.35-.6.55l-1.95 1.85-1.1 1c-1 1-1.7 1.65-2.1 1.9l-.5.35c-.4.25-.65.45-.75.45-.25.15-.45.35-.65.6-.15.3-.25.55-.25.75l.3.65c.55-.2 1.2-.65 2.05-1.35.85-.75 1.65-1.55 2.5-2.5.8-.9 1.6-1.65 2.4-2.3.8-.65 1.4-.95 1.9-1 .15 0 1.5 1.05 4.1 3.2 2.6 2.15 4.3 3.55 5.05 4.2l.2.45c.1-.05.2-.15.3-.3.1-.15.15-.3.15-.45z" />
                            </svg>
                        </button>
                    </div>

                    <div className="edit-inner">
                        <form onSubmit={handleSave}>
                            <div className="row">

                                {/* Name */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Promoter Name</label>
                                        <input
                                            type="text"
                                            ref={nameRef}
                                            placeholder="e.g. Riya Queen"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                        {errors.name && <span className="text-danger pt-1 d-block" style={{ fontSize: '0.82rem' }}>{errors.name}</span>}
                                    </div>
                                </div>

                                {/* Slug */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Custom Slug</label>
                                        <input
                                            type="text"
                                            ref={slugRef}
                                            placeholder="e.g. RiyaQueen  (no spaces)"
                                            value={form.custom_slug}
                                            onChange={e => setForm({ ...form, custom_slug: e.target.value.replace(/\s/g, '') })}
                                        />
                                        {errors.custom_slug
                                            ? <span className="text-danger pt-1 d-block" style={{ fontSize: '0.82rem' }}>{errors.custom_slug}</span>
                                            : form.custom_slug && (
                                                <span style={{ fontSize: '0.78rem', color: '#888', marginTop: 4, display: 'block' }}>
                                                    Install link: <code>{getPlayStoreLink(form.custom_slug)}</code>
                                                </span>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* Content Type */}
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Content Access</label>
                                        <div className="d-flex gap-3 mt-1">
                                            {['normal', 'premium'].map(type => (
                                                <label key={type} className="d-flex align-items-center gap-2"
                                                    style={{ cursor: 'pointer', padding: '10px 18px', borderRadius: 8,
                                                        border: `2px solid ${form.allowed_content_type === type ? 'var(--first-color, #FF5733)' : '#333'}`,
                                                        background: form.allowed_content_type === type ? 'rgba(255,87,51,0.1)' : 'transparent',
                                                        flex: 1 }}>
                                                    <input
                                                        type="radio"
                                                        name="allowed_content_type"
                                                        value={type}
                                                        checked={form.allowed_content_type === type}
                                                        onChange={() => setForm({ ...form, allowed_content_type: type })}
                                                        style={{ accentColor: 'var(--first-color, #FF5733)' }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                                            {type === 'premium' ? '⭐ ' : '✓ '}{type}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                                            {type === 'normal' ? 'Short drama series only' : 'All content including premium videos'}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Save button */}
                                <div className="col-12">
                                    <div className="action-footer">
                                        <button className="btn" type="submit" disabled={saving}>
                                            {saving ? (
                                                <div className="spinner-border text-light" style={{ width: 16, height: 16 }} role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : '💾 Save Promoter'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </Model>
            )}
        </>
    );
};

export default Promoters;
