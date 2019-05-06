import React, { PureComponent } from "react"
import { Link } from "react-router-dom"
import Icon from "react-fontawesome"
import moment from "moment"

import "./style.css"

export default class Navigator extends PureComponent {
    render() {
        return (
            <nav className="navigator">
                <div className="day">
                    <div className="controls btn-group btn-lg">
                        <LinkToDate date={this.props.date.clone().subtract(1, "days")} className="btn btn-default btn-lg">
                            <Icon name="chevron-left" />
                        </LinkToDate>
                        <LinkToDate date={moment()} className="btn btn-default btn-lg">
                            dnes
                        </LinkToDate>
                        <LinkToDate date={this.props.date.clone().add(1, "days")} className="btn btn-default btn-lg">
                            <Icon name="chevron-right" />
                        </LinkToDate>
                    </div>
                    <h3>
                        {this.props.date.format("dddd, LL")}
                    </h3>
                </div>
            </nav>
        )
    }
}

const LinkToDate = ({ date, ...props }) => (
    <Link {...props} to={date.format("/YYYY/MM/DD")} />
)