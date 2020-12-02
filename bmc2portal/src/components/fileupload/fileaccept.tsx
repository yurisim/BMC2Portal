import React, { ReactElement } from 'react'

type FAProps = {
    acceptedFile: File
}

/**
 * FileAccept is just a stylized box for a successful upload notification.
 */
export default class FileAccept extends React.PureComponent<FAProps, Record<string,unknown>> {

    style={
        backgroundColor: "#08AE2A",
        color: "white",
        borderRadius:"10px",
        opacity:"75%",
        padding: "5px"
    }

    render(): ReactElement{
        const { acceptedFile } = this.props
        return (
            <div style={this.style}>
                {acceptedFile.name}
            </div>
        )
    }
}