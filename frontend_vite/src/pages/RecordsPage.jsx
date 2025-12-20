import React, { useEffect, useState, useRef } from "react";
import ReactPaginate from "react-paginate";
import "../css/bootstrap.js"
import Button from "react-bootstrap/Button";
import AddRecordModal from '../components/AddRecordModal.jsx'

function RecordsPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(100);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [recordFilter, setrecordFilter] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const isSavingRef = useRef(false);

  const handleSave = async (data) => {

    console.log("handleSave running ....");

    if (isSavingRef.current) {
      console.log("Blocked: Save already in progress");
      return;
    }

    try {

      console.log("actual save handleSave");
      isSavingRef.current = true;
      setSaving(true);

      // Save record to backend
      await saveRecord(data);

      // Refresh grid after successful save
      await fetchRecords();

      // Close modal
      setShowModal(false);

    } catch (err) {
      console.error("Error in handleSave:", err);
      alert(err.message);
    } finally {
      // Always reset saving state and allow retry
      isSavingRef.current = false;
      setSaving(false);
    }

  };

  const saveRecord = async (data) => {

    console.log("saving record in action saveRecord ...");
    try {

      console.log("saveRecord...", data);

      const res = await fetch("http://localhost:4001/api/addrecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });


      console.log(res);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      console.log("Record saved successfully");

    } catch (err) {
      alert(err);
      console.error("SaveRecord error:", err);
      throw err;
    } finally {
      setSaving(false);
    }

  };

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);


  useEffect(() => {

    const controller = new AbortController();
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          page: currentPage,
          flag: recordFilter,
          recordLimit: recordsPerPage,
        });


        const res = await fetch(
          `${apiUrl}/getRecords?${params}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setRecords(data.data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();

    return () => controller.abort();
  }, [searchTerm, recordFilter, recordsPerPage,]);

  /* ---------------- FILTER LOGIC (Now managed to server side using api) ---------------- */
  const filteredRecords = records;
  /* ---------------- PAGINATION ---------------- */
  const pageCount = Math.ceil(
    filteredRecords.length / recordsPerPage
  );

  const offset = currentPage * recordsPerPage;
  const currentRecords = filteredRecords.slice(
    offset,
    offset + recordsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, recordFilter, recordsPerPage]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const flagStatus =
    { 1: "🟢 Good", 2: "🟡 Needs Checking", 3: "🔴 Bad", 4: "⚪ Unchecked" };
  /* ---------------- RENDER ---------------- */
  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-4">Espanol English Translation CRUD</h1>

      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Record
      </Button>

      <AddRecordModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        saving={saving}
      />

      {/* FILTER BAR */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search Keyword english or spanish."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={recordFilter}
            onChange={(e) => setrecordFilter(e.target.value)}
          >
            <option value="">Filter Flag</option>
            {[...Array(4)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {flagStatus[i + 1]}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={recordsPerPage}
            onChange={(e) =>
              setRecordsPerPage(Number(e.target.value))
            }
          >
            <option value={100}>100 per page</option>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
          </select>
        </div>
      </div>

      {/* Records */}

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Sr No.</th>
            <th>Spanish</th>
            <th>English</th>
            <th>Flag</th>
            <th>POS</th>
            <th>Description</th>
            <th>Audio File</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentRecords.map((record, index) => (
            <tr key={record.id}>
              <td>{offset + (index + 1)}</td>
              <td><strong>{record.spanish}</strong></td>
              <td>{record.english}</td>
              <td>{flagStatus[record.flag]}</td>
              <td>{record.pos}</td>
              <td>{record.description}</td>
              <td>{record.audio_file}</td>
              <td>
                <Button variant="warning">Edit{record.id}</Button>
                <Button variant="danger">Delete{record.id}</Button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>


      {/* PAGINATION */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next ›"
        previousLabel="‹ Prev"
        onPageChange={handlePageClick}
        pageRangeDisplayed={100}
        marginPagesDisplayed={1}
        pageCount={pageCount}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item disabled"
        breakLinkClassName="page-link"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}

export default RecordsPage;