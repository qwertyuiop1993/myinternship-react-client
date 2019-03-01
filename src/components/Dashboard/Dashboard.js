import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";

import * as actions from "actions";
import requireStudentAuth from "requireStudentAuth";
import Navbar from "./Navbar";
import SharedList from "./SharedList";

class Dashboard extends Component {
  async componentDidMount() {
    await this.props.removeErrorMessage();
    this.props.fetchCompanies();
  }

  renderError() {
    const { authMessage, t } = this.props;
    if (authMessage) {
      return (
        <Message
          style={{ marginBottom: "15px", width: "80%" }}
          error
          header={t("studentForms.formErrors.errorHeader")}
          content={authMessage}
        />
      );
    }
  }

  render() {
    const { t } = this.props;

    return (
      <div className="dashboard-container">
        <Navbar auth={this.props.auth} />
        <div className="dashboard-flex-box">
          <div className="main-box">
            <h1>{t("dashboard.header")}</h1>
            {this.renderError()}
            <div id="company-choices">
              <div id="choices">
                <h2>{t("dashboard.choices")}</h2>
                <p>{t("dashboard.choicesPrompt")}</p>
                <SharedList
                  items={this.props.auth.choices}
                  onChange={(order, sortable, evt) => {
                    // action creator to submit choices
                    this.props.updateStudentChoices(order);

                  }}
                  listType="ol"
                  type="choices"
                />
              </div>
              <div id="options">
                <h2>{t("dashboard.options")}</h2>
                <p>{t("dashboard.optionsPrompt")}</p>
                <SharedList
                  items={this.props.companies}
                  onChange={(order, sortable, evt) => {
                    this.setState({ options: order });
                  }}
                  listType="ul"
                  type="options"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    authMessage: state.authMessage,
    companies: state.companies
  };
};

const wrapped = connect(mapStateToProps, actions)(requireStudentAuth(Dashboard));
export default withTranslation()(wrapped);
