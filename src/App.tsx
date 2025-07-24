import { Box, Button, ButtonGroup, Heading, HStack, Select, useToast } from '@chakra-ui/react';
import { addEdge, applyEdgeChanges, applyNodeChanges, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { api } from './axios/config';
import type { ResponseAPI, TEdge, TNode, TPages } from './types/types';

const initialNodes: TNode[] = [];
const initialEdges: TEdge[] = [];


const dataPages: TPages = {
  home: { id: 1, title: 'Home', description: 'Home Page' },
  flights: { id: 2, title: 'Flights', description: 'Flights Page' },
  passengers: { id: 3, title: 'Passengers', description: 'Passengers Page' },
  services: { id: 4, title: 'Services', description: 'Services Page' },
  seats: { id: 5, title: 'Seats', description: 'Seats Page' },
  payment: { id: 6, title: 'Payment', description: 'Payment Page' }
};

export default function App() {
  const [statusAPI, setStatusAPI] = useState(false);
  const [pages,] = useState(dataPages);
  const [selectedPage, setSelectedPage] = useState<keyof TPages>('home');
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const toast = useToast();

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => {
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
      console.log("Edge added: ", params);
    },
    [],
  );

  const handlechangePage = (value: string) => {
    const pageValue = value as keyof TPages;
    console.log("Changing page to:", pageValue);
    setSelectedPage(pageValue);
  };

  const addNodeFlow = useCallback(() => {
    console.log("Adding new node: ", selectedPage);
    const page = pages[selectedPage || 'home'];
    if (!page) {
      console.error("No page selected or page not found");
      return nodes;
    }
    const newNode = {
      id: page.id.toString(),
      position: { x: Math.random() * 10, y: Math.random() * 10 },
      data: { label: `go ${page.title}` }
    };
    nodes.push(newNode);
    setNodes([...nodes]);
    console.log("Current nodes: ", nodes);
  }, [selectedPage, pages]);

  type Step = {
    id: number;
    accion: string;
    selector?: string;
    valor?: string;
    tipo?: string;
  }
  const executeFlow = async () => {
    try {

      const objPost = {
        nameFlow: "Playwright Flow",
        steps: nodes.map((node) => {
          const step: Step = {
            id: parseInt(node.id),
            accion: node.data.label.replace('go ', ''),
          };
          return step;
        }),
      }

      const response = await api.post('/execute', objPost);
      const data: ResponseAPI = response.data;
      toast({
        title: data.message,
        status: response.status === 200 ? 'success' : 'error',
        duration: 5000,
        isClosable: true
      })
      console.log("Flow data: ", data);
    } catch (error) {
      console.error("Error executing flow: ", error);
    }
  };

  const validateAPI = async () => {
    try {

      const response = await api.get('/status');
      const data: ResponseAPI = response.data;
      console.log("API response: ", data);
      toast({
        title: data.message,
        description: response.status === 200 ? "puedes continuar con el flujo." : 'Ocurrí un error al validar la API.',
        status: response.status === 200 ? 'success' : 'error',
        duration: 3000,
        isClosable: true
      });
      setStatusAPI(true);
    } catch (error) {
      console.error("Error validating API: ", error);
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <Heading textAlign={"center"}>Playwright Flow UI - Avianca QA</Heading>
        <HStack spacing={4} marginTop={4}>
          <Box>
            <Select placeholder='Selecciona una página' onChange={(e) => handlechangePage(e.target.value)}>
              {Object.entries(pages).map(([key, page]) => (
                <option key={key} value={key}>
                  {page.title}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <ButtonGroup gap={2}>
              <Button colorScheme='purple' onClick={validateAPI}>Validar estado API</Button>
              <Button isDisabled={!statusAPI} colorScheme='cyan' onClick={addNodeFlow}>Agregar nuevo node</Button>
              <Button isDisabled={!statusAPI} colorScheme='orange' onClick={executeFlow}>Ejecutar flujo</Button>
            </ButtonGroup>
          </Box>
        </HStack>
      </div>
      <div style={{ width: '100%', height: 'calc(100% - 100px)', position: 'relative', background: '#f0f0f0' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        />
      </div>
    </div>
  );
}
