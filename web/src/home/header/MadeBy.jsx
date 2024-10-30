import { HeartFilled } from "@ant-design/icons";

const MadeBy = () => {
    const url = "https://github.com/saravanabalagi";
    return (
        <div className="made-by" onClick={() => window.open(url, "_blank")}>
            Made with
            <HeartFilled className="icon" />
            by
            <a
                className="name"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                Saravanabalagi
            </a>
        </div>
    );
};

export default MadeBy;
