import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./index.css"

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [recordFilter, setrecordFilter] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // 🔁 Later replace with query params:
        // `/posts?userId=${recordFilter}&q=${searchTerm}&_page=${currentPage+1}`
        // "https://jsonplaceholder.typicode.com/posts" // reference url. (though same json is imported) using backend api call (node + mysql).
        const res = await fetch(
          "http://localhost:4001/getRecords"
        );
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  /* ---------------- FILTER LOGIC (CLIENT SIDE) ---------------- */
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      (searchTerm == "") || 
      (record.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.english.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFlag =
      ((record.flag == recordFilter) || (recordFilter == 0)) ;// will push to array if flag value found (0 to handle default state)

    return matchesSearch && matchesFlag;
  });

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
  }, [searchTerm, recordFilter, recordsPerPage]);// recordFilter

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={recordFilter}
            onChange={(e) => setrecordFilter(e.target.value)}
          >
            <option value="0">All Flags</option>
            {[...Array(4)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Flag Status {i + 1}
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
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Records */}
      <ul className="list-group mb-4">
        {currentRecords.map((record) => (
          <li key={record.id} className="list-group-item">
            <strong>{record.spanish}</strong>
            <p className="mb-0">{record.english}</p>
            <small className="text-muted">
              Spanish to English Id {record.id}
            </small>
          </li>
        ))}
      </ul>

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
