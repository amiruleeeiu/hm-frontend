import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

const Breadcrumb = (props) => {
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box">
          {/* <h4 className="mb-0 font-size-18 mb-2">{props.breadcrumbItem}</h4> */}
          <div className="page-title-right">
            <ol className="breadcrumb m-0">
              {props?.list?.map((item, key) => {
                return (
                  <li className={`breadcrumb-item `} key={key}>
                    <Link
                      to={item?.to ?? "#"}
                      className={`${
                        key + 1 === props?.list?.length ? "active" : "text-decoration-none"
                      }`}
                    >
                      {item?.title}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Col>
    </Row>
  );
};

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string,
};

export default Breadcrumb;
