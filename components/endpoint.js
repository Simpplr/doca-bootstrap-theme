const React = require('react');
const ObjectDefinitionTable = require('./objectDefinitionTable');
const MarkdownPreview = require('react-marked-markdown').MarkdownPreview;
const ImmutablePropTypes = require('react-immutable-proptypes');
const Component = require('react-pure-render/component');

function getEndpointCallExample(link) {
  const argumentList = link.get('isParamsObjectArgument')
    ? 'paramsObject'
    : link.getIn(['parameters', 'all_props']).keySeq().join(', ');

  return `Simpplr.Salesforce.${link.get('title')}(${argumentList})`;
}

class Endpoint extends Component {

  static propTypes = {
    link: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { link } = this.props;
    return (
      <section key={link.get('html_id')} id={link.get('html_id')} className="list-group-item">
        <h2>
          {link.get('title')}
        </h2>
        {link.get('description') && <MarkdownPreview value={link.get('description')} />}
        <pre>
          {getEndpointCallExample(link)}
        </pre>
        {link.get('url') && <pre>{link.get('url')}</pre>}

        {link.get('info', []).map(info => (
          <div className="alert alert-info" role="alert"><strong>Info:</strong> {info}</div>
        ))}

        {link.get('warning', []).map(warning => (
          <div className="alert alert-warning" role="alert"><strong>Warning:</strong> {warning}</div>
        ))}

        {link.getIn(['parameters', 'required_props', 0]) &&
          <div>
            <h4>Required parameters</h4>
            <ObjectDefinitionTable
              definitions={
                link.getIn(['parameters', 'all_props']).filter((val, key) =>
                  link.getIn(['parameters', 'required_props']).indexOf(key) > -1
                )
              }
            />
          </div>
        }

        {link.getIn(['parameters', 'optional_props', 0]) &&
          <div>
            <h4>Optional parameters</h4>
            <ObjectDefinitionTable
              definitions={
                link.getIn(['parameters', 'all_props']).filter((val, key) =>
                  link.getIn(['parameters', 'optional_props']).indexOf(key) > -1
                )
              }
            />
          </div>
        }

        <h4>Response</h4>
        <div>
          <pre>{link.get('response')}</pre>
        </div>
      </section>
    );
  }

}

module.exports = Endpoint;
