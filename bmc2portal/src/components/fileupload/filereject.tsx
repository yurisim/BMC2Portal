import React, { ReactElement } from 'react'
import { FileRejection } from 'react-dropzone'

type FRProps = {
    rejectedFile: FileRejection
}

/**
 * FileReject is just a stylized box for a successful upload notification.
 */
export default class FileReject extends React.PureComponent<FRProps, Record<string,unknown>> {

    style={
        backgroundColor: "#EC3C3C",
        color: "white",
        borderRadius:"10px",
        opacity:"75%",
        padding: "5px"
    }

    render(): ReactElement {
        const { rejectedFile } = this.props
        return (
            <div style={this.style}>
                {rejectedFile.file.name} - {rejectedFile.errors[0].message}
            </div>
        )
    }
}