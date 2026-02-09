import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { MapPin } from "lucide-react";
import profilePic from "../assets/profile_pic.jpg";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { assets } from "../assets/assets";

const VolunteerProfile = () => {
  const {
    userData,
    setUserData,
    loadUserProfileData,
    backendUrl,
    token,
    role,
    setToken,
    setRole,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form, setForm] = useState({
    name: "",
    number: "",
    skills: "",
    availability: "",
    assignedAreas: "",
    address: "",
  });
 

  useEffect(() => {
    if (!userData && token && role === "volunteer") {
      loadUserProfileData();
    }
  }, [userData, token, role]);

  useEffect(() => {
    if (!isEdit || !userData) return;
    const address =
      typeof userData.address === "string"
        ? userData.address
        : [userData.address?.line1, userData.address?.line2].filter(Boolean).join(" ");
    setForm({
      name: userData.name || "",
      number: userData.number || "",
      skills: Array.isArray(userData.skills) ? userData.skills.join(", ") : userData.skills || "",
      availability: userData.availability || "",
      assignedAreas: Array.isArray(userData.assignedAreas)
        ? userData.assignedAreas.join(", ")
        : userData.assignedAreas || "",
      address: address || "",
    });
    setImageFile(null);
    setImagePreview("");
  }, [isEdit, userData]);

  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  if (!userData) return null;


  const loadRequests = async () => {
    try {
      setLoading(true);
     
      const res = await axios.get(
        `${backendUrl}/api/volunteer/requests/all`,
        { headers: { token } }
      );
      if (res.data?.success) {
        setRequests(res.data.data || []);
      }
    } catch {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/volunteer/requests/${id}/accept`,
        {},
        { headers: { token } }
      );
      if (res.data?.success) {
        setRequests((prev) => prev.filter((r) => r._id !== id));
        toast.success("Request accepted");
      }
    } catch {
      toast.error("Unable to accept request");
    }
  };

  const saveProfile = async () => {
    try {
      if (!token) return;
      setSaving(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("number", form.number);
      fd.append("skills", form.skills);
      fd.append("availability", form.availability);
      fd.append("assignedAreas", form.assignedAreas);
      fd.append("address", form.address);
      if (imageFile) fd.append("image", imageFile);

      const res = await axios.post(`${backendUrl}/api/volunteer/update-profile`, fd, {
        headers: { token },
      });
      if (res.data?.success) {
        setUserData(res.data.data || null);
        toast.success("Profile updated");
        setIsEdit(false);
        setImageFile(null);
        setImagePreview("");
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const generateCertificate = async () => {
    try {
      if (!token) return false;
      setCertLoading(true);

      const certRes = await axios.get(`${backendUrl}/api/volunteer/appreciation-certificate`, {
        headers: { token },
      });
      if (!certRes.data?.success) {
        toast.error(certRes.data?.message || "Failed to generate certificate");
        return false;
      }

      const data = certRes.data.data;
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      pdf.setFillColor(6, 95, 70);
      pdf.rect(0, 0, pageWidth, 18, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.text("AnnSetu Foundation", pageWidth / 2, 11, { align: "center" });

      pdf.setTextColor(6, 95, 70);
      pdf.setFontSize(26);
      pdf.text("Certificate of Appreciation", pageWidth / 2, 40, { align: "center" });

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(12);
      pdf.text("This certificate is proudly presented to", pageWidth / 2, 55, { align: "center" });

      pdf.setFontSize(20);
      pdf.text(String(data.volunteerName || "Volunteer"), pageWidth / 2, 70, { align: "center" });

      pdf.setFontSize(11);
      const body =
        "In recognition of your good works, great efforts, and meaningful contribution toward making change with AnnSetu Foundation.";
      const textWidth = pageWidth - 40;
      const wrapped = pdf.splitTextToSize(body, textWidth);
      pdf.text(wrapped, pageWidth / 2, 85, { align: "center" });

      pdf.setFontSize(11);
      const joined = new Date(data.joinedAt).toLocaleDateString();
      const left = new Date(data.leftAt).toLocaleDateString();
      const completed = data.completedDeliveries ?? 0;

      pdf.text(`Joined On: ${joined}`, 30, 120);
      pdf.text(`Left On: ${left}`, 30, 130);
      pdf.text(`Completed Deliveries: ${completed}`, 30, 140);

      pdf.setFontSize(10);
      pdf.text("AnnSetu Foundation", pageWidth - 30, 135, { align: "center" });
      pdf.line(pageWidth - 55, 138, pageWidth - 5, 138);
      pdf.text("Authorized Signature", pageWidth - 30, 145, { align: "center" });

      pdf.save("AnnSetu-Volunteer-Appreciation-Certificate.pdf");

      return true;
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to generate certificate");
      return false;
    } finally {
      setCertLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      if (!token) return;
      const ok = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
      if (!ok) return;
      setDeleting(true);
      await generateCertificate();

      const res = await axios.delete(`${backendUrl}/api/volunteer/delete-account`, {
        headers: { token },
      });
      if (res.data?.success) {
        toast.success("Account deleted");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(false);
        setRole("");
        setUserData(false);
        navigate("/register/volunteer");
      } else {
        toast.error(res.data?.message || "Failed to delete account");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

return (
  <div className="min-h-screen bg-slate-100 py-10 px-4 mt-20">
    <div className="mx-auto max-w-5xl space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Volunteer Profile</h1>
          <p className="text-sm text-slate-500">Manage your personal information</p>
        </div>

        {!isEdit && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsEdit(true)}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Edit Profile
            </button>

            <button
              onClick={generateCertificate}
              disabled={certLoading}
              className="rounded-lg border border-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-500 hover:text-white disabled:opacity-60"
            >
              {certLoading ? "Downloading..." : "Certificate"}
            </button>

            <button
              onClick={deleteAccount}
              disabled={deleting}
              className="rounded-lg border border-red-500 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-60"
            >
              {deleting ? "Processing..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

          {/* IMAGE */}
          <div className="relative">
            <img
              src={isEdit ? imagePreview || userData.image || profilePic : userData.image || profilePic}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-emerald-500"
              alt="profile"
            />

            {isEdit && (
              <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1 rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (!file) return setImagePreview("");
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            )}
          </div>

          {/* BASIC INFO */}
          <div className="flex-1 space-y-2">
            {isEdit ? (
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full text-xl font-semibold border-b focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <h2 className="text-xl font-semibold text-slate-800">{userData.name}</h2>
            )}

            <p className="text-sm text-slate-500">{userData.email}</p>

            {isEdit && (
              <button
                onClick={saveProfile}
                disabled={saving}
                className="mt-4 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CONTACT */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Contact Information</h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500">Phone</p>
              {isEdit ? (
                <input
                  value={form.number}
                  onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              ) : (
                <p>{userData.number || "-"}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Address</p>
              {isEdit ? (
                <input
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              ) : (
                <p>{userData.address || "-"}</p>
              )}
            </div>
          </div>
        </div>

        {/* VOLUNTEER */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Volunteer Information</h3>

          <div className="space-y-3 text-sm">
            <p><span className="text-slate-500">Skills:</span> {userData.skills || "-"}</p>
            <p><span className="text-slate-500">Availability:</span> {userData.availability || "-"}</p>
            <p><span className="text-slate-500">Assigned Areas:</span> {userData.assignedAreas || "-"}</p>
            <p>
              <span className="text-slate-500">Approved:</span>{" "}
              <span className={userData.approved ? "text-emerald-600" : "text-red-500"}>
                {userData.approved ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* REQUESTS */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Nearby Delivery Requests</h3>
          <button onClick={loadRequests} className="border px-4 py-2 rounded-lg text-sm">
            {loading ? "Loading..." : "Load"}
          </button>
        </div>

        {requests.length === 0 ? (
          <p className="text-sm text-slate-500">No requests available</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r._id}
                className="flex justify-between items-center border rounded-xl p-4 hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium">{r.foodName}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin size={14} />
                    {r.address}
                  </p>
                </div>

                <button
                  onClick={() => acceptRequest(r._id)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  </div>
);

};

export default VolunteerProfile;
