import React, { ReactElement } from 'react'
import { FileRejection } from 'react-dropzone'

type FRProps = {
    rejectedFile: FileRejection
}

/**
 * FileReject is just a stylized box for a successful upload notification.
 */
export default class FileReject extends React.Component<FRProps, Record<string,unknown>> {

    style={
        backgroundColor: "#EC3C3C",
        color: "white",
        borderRadius:"10px",
        opacity:"75%",
        padding: "5px"
    }

    render(): ReactElement {
        return (
            <div style={this.style}>
                {this.props.rejectedFile.file.name} - {this.props.rejectedFile.errors[0].message}
            </div>
        )
    }
}