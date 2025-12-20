import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const apiUrl = import.meta.env.VITE_API_URL;

const flagStatus =
  { 1: "🟢 Good", 2: "🟡 Needs Checking", 3: "🔴 Bad", 4: "⚪ Unchecked" };

const controller = new AbortController();


export default function AddRecordModal({ show, onClose, onSave }) {
  const [spanish, setSpanish] = useState("");
  const [english, setEnglish] = useState("");

  const [flag, setFlag] = useState("4");

  const [posOptions, setPosOptions] = useState([]);
  const [selectedPos, setSelectedPos] = useState([]);


  const resetForm = () => {
    setSpanish("");
    setEnglish("");
    setFlag("4");
    setSelectedPos([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    console.trace("MODAL handleSubmit called");
    onSave({ spanish, english, flag: Number(flag), pos: selectedPos });
    resetForm();
    onClose();
  };



  useEffect(() => {
    fetch(`${apiUrl}/api/pos`)
      .then(res => res.json())
      .then(data => setPosOptions(data.data))
      .catch(console.error);
  }, []);


  const handlePosChange = (pos) => {
    setSelectedPos((prev) =>
      prev.includes(pos)
        ? prev.filter(p => p !== pos)
        : [...prev, pos]
    );
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Record</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Spanish</Form.Label>
            <Form.Control
              value={spanish}
              onChange={(e) => setSpanish(e.target.value)}
              placeholder="Enter Spanish word"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>English</Form.Label>
            <Form.Control
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="Enter English meaning"
            />
          </Form.Group>

          {/* Flag Dropdown */}
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
            >
              {Object.entries(flagStatus).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Parts of Speech</Form.Label>

            {posOptions.map((item) => (
              <Form.Check
                key={item.pos}
                type="checkbox"
                id={`pos-${item.pos}`}
                label={item.description}
                checked={selectedPos.includes(item.pos)}
                onChange={() => handlePosChange(item.pos)}
              />
            ))}
          </Form.Group>

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
