const Button = (props) => {
  return (
    <div className="d-grid col-4 mx-auto join-button shadow p-4 mb-6 bg-body-tertiary rounded">
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">@</span>
        <input
          type="text"
          className="form-control"
          value={props.customerId}
          placeholder="Enter customer ID"
          onChange={props.cutomrtIdChange}
          aria-label="Username" aria-describedby="basic-addon1"
        />
      </div>
      <button onClick={props.click} type="button" className="btn btn-primary">
        {props.name}
      </button>
    </div>
  )
}

export default Button