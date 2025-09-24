import React from 'react';
import { ArrowDown } from 'lucide-react';

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
    <div className="mx-auto w-full max-w-lg p-4">
      <div className="text-gray-450 mb-4 flex items-center gap-x-1 text-sm">
        <span>Protocolos</span>
        <ArrowDown size={14} />
      </div>

      <div className="w-full flex-row space-y-4">
        {protocols.map((protocol) => (
          <div
            key={protocol.id}
            className="flex items-start justify-between border-t border-b border-gray-200 p-4"
          >
            <span className="text-gray-160 flex-grow pr-4 text-sm font-medium">
              {protocol.description}
            </span>
            <div className="mt-auto flex flex-shrink-0 flex-row space-x-3">
              <button
                type="button"
                className="text-xs text-gray-400 hover:underline"
                onClick={() => onEdit(protocol)}
              >
                Editar
              </button>
              <button
                type="button"
                className="text-xs text-gray-400 hover:underline"
                onClick={() => onRemove(protocol)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtocolList;
