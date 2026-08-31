import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import PortalLayout from "../components/PortalLayout";
import "../App.css";

const API_URL = "http://localhost:5000";

function Offers() {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("token");

  // =====================================================
  // FETCH OFFERS
  // =====================================================

  const fetchOffers = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const controller =
        new AbortController();

      const timeoutId =
        setTimeout(() => {
          controller.abort();
        }, 10000);

      const response = await fetch(
        `${API_URL}/api/student/offers`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          signal:
            controller.signal
        }
      );

      clearTimeout(timeoutId);

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "role"
        );

        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Unable to load offers (${response.status})`
        );
      }

      let offerList = [];

      if (Array.isArray(data)) {
        offerList = data;
      } else if (
        Array.isArray(data.offers)
      ) {
        offerList = data.offers;
      } else if (
        Array.isArray(data.data)
      ) {
        offerList = data.data;
      } else if (
        data.data &&
        Array.isArray(
          data.data.offers
        )
      ) {
        offerList =
          data.data.offers;
      }

      setOffers(offerList);
    } catch (err) {
      console.error(
        "Offers fetch error:",
        err
      );

      if (
        err.name ===
        "AbortError"
      ) {
        setError(
          "The server took too long to respond. Check whether the backend is running."
        );
      } else {
        setError(
          err.message ||
            "Unable to load offers"
        );
      }

      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    window.scrollTo(0, 0);
  }, []);

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (offer) => {
    return (
      offer.decision ||
      offer.status ||
      offer.offerStatus ||
      "Pending"
    );
  };

  // =====================================================
  // PACKAGE NUMBER
  // =====================================================

  const getPackageNumber = (
    offer
  ) => {
    const value =
      offer.ctc ??
      offer.totalPackage ??
      offer.package ??
      offer.salary ??
      offer.packageLpa ??
      0;

    if (
      typeof value === "number"
    ) {
      return value;
    }

    const match =
      String(value).match(
        /[\d.]+/
      );

    return match
      ? Number(match[0])
      : 0;
  };

  // =====================================================
  // DISPLAY PACKAGE
  // =====================================================

  const displayPackage = (
    offer
  ) => {
    const value =
      offer.ctc ??
      offer.totalPackage ??
      offer.package ??
      offer.salary ??
      offer.packageLpa;

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "Not specified";
    }

    const text =
      String(value);

    if (
      text
        .toLowerCase()
        .includes("lpa")
    ) {
      return text;
    }

    return `${text} LPA`;
  };

  // =====================================================
  // FILTER
  // Search removed for common portal design
  // =====================================================

  const filteredOffers =
    useMemo(() => {
      if (filter === "All") {
        return offers;
      }

      return offers.filter(
        (offer) => {
          const status =
            String(
              getStatus(offer)
            ).toLowerCase();

          return (
            status ===
            filter.toLowerCase()
          );
        }
      );
    }, [offers, filter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalOffers =
    offers.length;

  const pendingOffers =
    offers.filter(
      (offer) => {
        const status =
          String(
            getStatus(offer)
          ).toLowerCase();

        return (
          status ===
            "pending" ||
          status ===
            "received"
        );
      }
    ).length;

  const acceptedOffers =
    offers.filter(
      (offer) =>
        String(
          getStatus(offer)
        ).toLowerCase() ===
        "accepted"
    ).length;

  const highestPackage =
    offers.length > 0
      ? Math.max(
          ...offers.map(
            (offer) =>
              getPackageNumber(
                offer
              )
          )
        )
      : 0;

  // =====================================================
  // ACCEPT / REJECT
  // =====================================================

  const handleDecision =
    async (
      offerId,
      decision
    ) => {
      try {
        const token =
          getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/student/offers/${offerId}/decision`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify({
                  decision
                })
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to update offer"
          );
        }

        await fetchOffers();
      } catch (err) {
        console.error(
          "Offer decision error:",
          err
        );

        alert(
          err.message ||
            "Unable to update offer"
        );
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete =
    async (offerId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this offer?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const token =
          getToken();

        if (!token) {
          navigate("/login");
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/student/offers/${offerId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to delete offer"
          );
        }

        await fetchOffers();
      } catch (err) {
        console.error(
          "Offer delete error:",
          err
        );

        alert(
          err.message ||
            "Unable to delete offer"
        );
      }
    };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not specified";
    }

    return parsedDate
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }
      );
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {
    const value =
      String(
        status || ""
      ).toLowerCase();

    if (
      value === "accepted"
    ) {
      return "accepted";
    }

    if (
      value === "rejected"
    ) {
      return "rejected";
    }

    if (
      value === "received"
    ) {
      return "received";
    }

    return "pending";
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <PortalLayout
      title="Offers"
      subtitle="Review placement offers, compensation and career opportunities."
    >
      <div className="offers-common-page">

        {loading ? (

          <div className="offers-loading">

            <h2>
              Loading offers...
            </h2>

            <p>
              Please wait while we
              load your placement
              offers.
            </p>

          </div>

        ) : (

          <>
            {/* =============================================
                HERO
            ============================================= */}

            <section className="offers-hero">

              <div>

                <div className="offers-eyebrow">
                  OFFER CENTER
                </div>

                <h1>
                  Job Offers
                </h1>

                <p>
                  Review your placement
                  offers, compare
                  compensation and make
                  better career decisions.
                </p>

              </div>

              <div className="offers-hero-actions">

                <Link
                  to="/offers/add"
                  className="offer-primary-btn"
                >
                  + Add Offer
                </Link>

                <Link
                  to="/applications"
                  className="offer-secondary-btn"
                >
                  View Applications
                </Link>

              </div>

            </section>

            {/* =============================================
                STATS
            ============================================= */}

            <section className="offers-stats">

              <div className="offer-stat-card">

                <span>
                  Total Offers
                </span>

                <strong>
                  {totalOffers}
                </strong>

                <small>
                  Offers received
                </small>

              </div>

              <div className="offer-stat-card">

                <span>
                  Pending Decision
                </span>

                <strong>
                  {pendingOffers}
                </strong>

                <small>
                  Waiting for response
                </small>

              </div>

              <div className="offer-stat-card">

                <span>
                  Accepted
                </span>

                <strong>
                  {acceptedOffers}
                </strong>

                <small>
                  Confirmed offers
                </small>

              </div>

              <div className="offer-stat-card">

                <span>
                  Highest Package
                </span>

                <strong>
                  {highestPackage > 0
                    ? `${highestPackage} LPA`
                    : "—"}
                </strong>

                <small>
                  Best compensation
                </small>

              </div>

            </section>

            {/* =============================================
                HEADER + FILTERS
            ============================================= */}

            <section className="offers-content">

              <div className="offers-section-header offers-section-common">

                <div>

                  <div className="offers-section-label">
                    YOUR OFFERS
                  </div>

                  <h2>
                    Placement Offers
                  </h2>

                  <p>
                    Compare your
                    opportunities before
                    making a final
                    decision.
                  </p>

                </div>

                <div className="offer-filters">

                  {[
                    "All",
                    "Pending",
                    "Received",
                    "Accepted",
                    "Rejected"
                  ].map(
                    (status) => (

                      <button
                        key={status}
                        type="button"
                        className={
                          filter ===
                          status
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setFilter(
                            status
                          )
                        }
                      >
                        {status}
                      </button>

                    )
                  )}

                </div>

              </div>

              {/* ERROR */}

              {error && (

                <div className="offers-error">

                  <strong>
                    {error}
                  </strong>

                  <button
                    type="button"
                    onClick={
                      fetchOffers
                    }
                  >
                    Try Again
                  </button>

                </div>

              )}

              {/* EMPTY */}

              {!error &&
                filteredOffers.length ===
                  0 && (

                  <div className="offers-empty">

                    <div className="offers-empty-icon">
                      ✦
                    </div>

                    <h3>
                      No offers found
                    </h3>

                    <p>
                      {offers.length ===
                      0
                        ? "You have not added any offers yet."
                        : "No offers match the selected filter."}
                    </p>

                    {offers.length ===
                      0 && (

                      <Link
                        to="/offers/add"
                        className="offer-primary-btn"
                      >
                        + Add Your First
                        Offer
                      </Link>

                    )}

                  </div>

                )}

              {/* ===========================================
                  OFFER CARDS
              =========================================== */}

              {!error && (

                <div className="offers-grid">

                  {filteredOffers.map(
                    (offer) => {
                      const status =
                        getStatus(
                          offer
                        );

                      const lowerStatus =
                        String(
                          status
                        ).toLowerCase();

                      return (

                        <article
                          className="offer-card"
                          key={
                            offer._id
                          }
                        >

                          {/* CARD HEADER */}

                          <div className="offer-card-top">

                            <div className="offer-company-info">

                              <div className="offer-company-logo">
                                {(offer.company ||
                                  "C")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="offer-company-text">

                                <h3>
                                  {offer.company ||
                                    "Company"}
                                </h3>

                                <p>
                                  {offer.role ||
                                    offer.jobRole ||
                                    "Role not specified"}
                                </p>

                              </div>

                            </div>

                            <span
                              className={`offer-status ${getStatusClass(
                                status
                              )}`}
                            >
                              {status}
                            </span>

                          </div>

                          {/* PACKAGE */}

                          <div className="offer-package-box">

                            <span>
                              Total Package
                            </span>

                            <strong>
                              {displayPackage(
                                offer
                              )}
                            </strong>

                            <small>
                              Annual CTC
                            </small>

                          </div>

                          {/* DETAILS */}

                          <div className="offer-details-grid">

                            <div>
                              <span>
                                Base Salary
                              </span>

                              <strong>
                                {offer.baseSalary
                                  ? `${offer.baseSalary} LPA`
                                  : offer.fixedSalary
                                  ? `${offer.fixedSalary} LPA`
                                  : "Not specified"}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Location
                              </span>

                              <strong>
                                {offer.location ||
                                  "Not specified"}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Work Mode
                              </span>

                              <strong>
                                {offer.workMode ||
                                  "Not specified"}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Bond
                              </span>

                              <strong>
                                {offer.bond ||
                                  "No information"}
                              </strong>
                            </div>

                          </div>

                          {/* DATES */}

                          <div className="offer-extra-info">

                            <div>
                              <span>
                                Joining Date
                              </span>

                              <strong>
                                {formatDate(
                                  offer.joiningDate
                                )}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Offer Date
                              </span>

                              <strong>
                                {formatDate(
                                  offer.offerDate ||
                                    offer.offerLetterDate
                                )}
                              </strong>
                            </div>

                          </div>

                          {/* NOTES */}

                          {(offer.notes ||
                            offer.remarks) && (

                            <div className="offer-remarks">

                              <span>
                                Notes
                              </span>

                              <p>
                                {offer.notes ||
                                  offer.remarks}
                              </p>

                            </div>

                          )}

                          {/* ACCEPT / REJECT */}

                          {(lowerStatus ===
                            "pending" ||
                            lowerStatus ===
                              "received") && (

                            <div className="offer-decision-buttons">

                              <button
                                type="button"
                                className="offer-accept-btn"
                                onClick={() =>
                                  handleDecision(
                                    offer._id,
                                    "Accepted"
                                  )
                                }
                              >
                                Accept Offer
                              </button>

                              <button
                                type="button"
                                className="offer-reject-btn"
                                onClick={() =>
                                  handleDecision(
                                    offer._id,
                                    "Rejected"
                                  )
                                }
                              >
                                Reject
                              </button>

                            </div>

                          )}

                          {/* ACTIONS */}

                          <div className="offer-card-actions">

                            <Link
                              to={`/offers/details?id=${offer._id}`}
                              className="offer-view-btn"
                            >
                              View Details
                            </Link>

                            <Link
                              to={`/offers/edit?id=${offer._id}`}
                              className="offer-edit-btn"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="offer-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  offer._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>

              )}

            </section>
          </>
        )}

      </div>
    </PortalLayout>
  );
}

export default Offers;
