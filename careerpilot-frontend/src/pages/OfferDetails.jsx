import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../App.css";

const API_URL = "https://careerpilot-wxja.onrender.com";

function OfferDetails() {
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get("id");

  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (value) => {
    if (!value) return "Not specified";

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  const fetchOffer = async () => {
    if (!offerId) {
      setError("Offer ID not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/student/offers/${offerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load offer.");
      }

      setOffer(data.offer || data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const updateDecision = async (decision) => {
    try {
      setActionLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/student/offers/${offerId}/decision`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            decision,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update offer decision."
        );
      }

      setOffer((previousOffer) => ({
        ...previousOffer,
        status:
          data.offer?.status ||
          data.data?.status ||
          decision,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-card">
          <p>Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="page-container">
        <div className="content-card">
          <h2>Unable to Load Offer</h2>
          <p>{error}</p>

          <Link to="/offers" className="secondary-btn">
            Back to Offers
          </Link>
        </div>
      </div>
    );
  }

  if (!offer) {
    return null;
  }

  const status = offer.status || "Received";

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <p className="section-label">OFFER DETAILS</p>

          <h1>{offer.company}</h1>

          <p>
            {offer.role}
            {offer.location ? ` • ${offer.location}` : ""}
          </p>
        </div>

        <div className="header-actions">
          <Link
            to={`/offers/edit?id=${offer._id}`}
            className="primary-btn"
          >
            Edit Offer
          </Link>

          <Link to="/offers" className="secondary-btn">
            ← Back
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="offer-details-grid">
        <div className="content-card">
          <p className="section-label">COMPENSATION</p>
          <h2>Package Details</h2>

          <div className="details-list">
            <div className="detail-row">
              <span>CTC</span>
              <strong>{formatSalary(offer.ctc)}</strong>
            </div>

            <div className="detail-row">
              <span>Base Salary</span>
              <strong>
                {formatSalary(offer.baseSalary)}
              </strong>
            </div>

            <div className="detail-row">
              <span>Bond</span>
              <strong>
                {offer.bond || "Not specified"}
              </strong>
            </div>
          </div>
        </div>

        <div className="content-card">
          <p className="section-label">JOB INFORMATION</p>
          <h2>Employment Details</h2>

          <div className="details-list">
            <div className="detail-row">
              <span>Company</span>
              <strong>{offer.company}</strong>
            </div>

            <div className="detail-row">
              <span>Role</span>
              <strong>{offer.role}</strong>
            </div>

            <div className="detail-row">
              <span>Location</span>
              <strong>
                {offer.location || "Not specified"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Work Mode</span>
              <strong>
                {offer.workMode || "Not specified"}
              </strong>
            </div>
          </div>
        </div>

        <div className="content-card">
          <p className="section-label">IMPORTANT DATES</p>
          <h2>Offer Timeline</h2>

          <div className="details-list">
            <div className="detail-row">
              <span>Offer Date</span>
              <strong>
                {formatDate(offer.offerDate)}
              </strong>
            </div>

            <div className="detail-row">
              <span>Joining Date</span>
              <strong>
                {formatDate(offer.joiningDate)}
              </strong>
            </div>

            <div className="detail-row">
              <span>Decision Deadline</span>
              <strong>
                {formatDate(offer.decisionDeadline)}
              </strong>
            </div>
          </div>
        </div>

        <div className="content-card">
          <p className="section-label">OFFER STATUS</p>
          <h2>Current Decision</h2>

          <span
            className={`offer-status-badge ${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {status}
          </span>

          <p className="offer-status-description">
            {status === "Accepted"
              ? "You have accepted this offer."
              : status === "Rejected"
              ? "You have rejected this offer."
              : "Review the offer carefully before making your decision."}
          </p>

          {status !== "Accepted" &&
            status !== "Rejected" && (
              <div className="offer-decision-actions">
                <button
                  type="button"
                  className="danger-btn"
                  disabled={actionLoading}
                  onClick={() =>
                    updateDecision("Rejected")
                  }
                >
                  {actionLoading
                    ? "Updating..."
                    : "Reject Offer"}
                </button>

                <button
                  type="button"
                  className="success-btn"
                  disabled={actionLoading}
                  onClick={() =>
                    updateDecision("Accepted")
                  }
                >
                  {actionLoading
                    ? "Updating..."
                    : "Accept Offer"}
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="content-card offer-notes-card">
        <p className="section-label">NOTES</p>
        <h2>Additional Information</h2>

        <p>
          {offer.notes ||
            "No additional notes have been added for this offer."}
        </p>
      </div>
    </div>
  );
}

export default OfferDetails;
