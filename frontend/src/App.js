import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./index.css"

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("");

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // 🔁 Later replace with query params:
        // `/posts?userId=${userFilter}&q=${searchTerm}&_page=${currentPage+1}`
        const res = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  /* ---------------- FILTER LOGIC (CLIENT SIDE) ---------------- */
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUser =
      userFilter === "" || post.userId === Number(userFilter);

    return matchesSearch && matchesUser;
  });

  /* ---------------- PAGINATION ---------------- */
  const pageCount = Math.ceil(
    filteredPosts.length / recordsPerPage
  );

  const offset = currentPage * recordsPerPage;
  const currentPosts = filteredPosts.slice(
    offset,
    offset + recordsPerPage
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, userFilter, recordsPerPage]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  /* ---------------- RENDER ---------------- */
  return (
    <div className="container mt-5">
      <h1 className="text-primary mb-4">Blog Posts</h1>

      {/* FILTER BAR */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search title or body..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          >
            <option value="">All Users</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                User {i + 1}
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

      {/* POSTS */}
      <ul className="list-group mb-4">
        {currentPosts.map((post) => (
          <li key={post.id} className="list-group-item">
            <strong>{post.title}</strong>
            <p className="mb-0">{post.body}</p>
            <small className="text-muted">
              User ID: {post.userId}
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
