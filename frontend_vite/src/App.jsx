import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./index.css"

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [recordFilter, setrecordFilter] = useState("");

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
  }, [searchTerm, recordFilter, recordsPerPage]);

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
            <option value={5}>5 per page</option>
            <option value={1}>1 per page</option>
            <option value={10}>10 per page</option>
          </select>
        </div>
      </div>

      {/* Records */}

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
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
          {currentRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td><strong>{record.spanish}</strong></td>
              <td>{record.english}</td>
              <td>{flagStatus[record.flag]}</td>
              <td>{record.pos}</td>
              <td>{record.description}</td>
              <td>{record.audio_file}</td>
              <td>Add_{record.id} Edit_{record.id}</td>
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
        pageRangeDisplayed={5}
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

export default App;