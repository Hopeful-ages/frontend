import React from 'react';

export interface Protocol {
  id: string | number;
  description: string;
}

interface ProtocolListProps {
  protocols: Protocol[];
  onEdit: (protocol: Protocol) => void;
  onRemove: (protocol: Protocol) => void;
}

const ProtocolList: React.FC<ProtocolListProps> = ({
  protocols,
  onEdit,
  onRemove,
}) => {
  if (protocols.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        Nenhum protocolo foi adicionado ainda.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {protocols.map((protocol) => (
        <div
          key={protocol.id}
          className="flex items-center justify-between border-t border-b border-gray-200 p-4"
        >
          <span className="text-gray-800">{protocol.description}</span>
          <div className="flex space-x-3">
            <button
              className="text-gray-300 hover:underline"
              onClick={() => onEdit(protocol)}
            >
              Editar
            </button>
            <button
              className="text-gray-300 hover:underline"
              onClick={() => onRemove(protocol)}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProtocolList;
