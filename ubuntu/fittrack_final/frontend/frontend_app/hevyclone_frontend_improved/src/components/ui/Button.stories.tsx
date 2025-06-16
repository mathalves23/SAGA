import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';
import { Download, Heart, Plus, Send, Trash2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Components/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
## Button Component

Componente de botão altamente customizável e acessível para o SAGA.

### Características:
- 🎨 **5 variantes visuais** (primary, secondary, outline, ghost, destructive)
- 📏 **4 tamanhos** (sm, md, lg, xl)
- ♿ **Totalmente acessível** (ARIA, keyboard navigation)
- 🎯 **Estados interativos** (hover, focus, active, disabled, loading)
- 🌙 **Dark mode** nativo
- 📱 **Responsivo** e mobile-friendly

### Uso:
\`\`\`tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Clique aqui
</Button>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
      description: 'Visual variant of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary Stories
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Botão Primário',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Botão Secundário',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Botão Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Botão Ghost',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Botão Destrutivo',
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Pequeno',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Médio',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Grande',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Grande',
  },
};

// State Stories
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Botão Desabilitado',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Carregando...',
  },
};

// With Icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="w-4 h-4 mr-2" />
        Adicionar
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    children: <Heart className="w-4 h-4" />,
    'aria-label': 'Favoritar',
  },
};

// Complex Examples
export const DownloadButton: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Download className="w-4 h-4 mr-2" />
        Download
      </>
    ),
  },
};

export const SendMessage: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: (
      <>
        <Send className="w-4 h-4 mr-2" />
        Enviar Mensagem
      </>
    ),
  },
};

export const DeleteAction: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir
      </>
    ),
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" disabled>Primary Disabled</Button>
        <Button variant="secondary" disabled>Secondary Disabled</Button>
        <Button variant="outline" disabled>Outline Disabled</Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" loading>Loading Primary</Button>
        <Button variant="secondary" loading>Loading Secondary</Button>
        <Button variant="outline" loading>Loading Outline</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase de todas as variantes disponíveis do botão.',
      },
    },
  },
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase de todos os tamanhos disponíveis do botão.',
      },
    },
  },
};

// Responsive Example
export const ResponsiveButton: Story = {
  render: () => (
    <Button className="w-full md:w-auto">
      Responsivo
    </Button>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Exemplo de botão responsivo que se adapta ao tamanho da tela.',
      },
    },
  },
};

// Dark Mode Example
export const DarkMode: Story = {
  args: {
    children: 'Botão Dark Mode',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        story: 'Exemplo do botão em modo escuro.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

// Interactive Example
export const InteractiveExample: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const handleClick = async () => {
      setLoading(true);
      // Simular operação async
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCount(prev => prev + 1);
      setLoading(false);
    };

    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600">Cliques: {count}</p>
        <Button onClick={handleClick} loading={loading}>
          {loading ? 'Processando...' : 'Clique aqui!'}
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo interativo mostrando estados de loading e feedback.',
      },
    },
  },
};

// A11y Example
export const AccessibilityExample: Story = {
  render: () => (
    <div className="space-y-4">
      <Button
        variant="primary"
        aria-describedby="help-text"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            console.log('Ativado via teclado');
          }
        }}
      >
        Botão Acessível
      </Button>
      <p id="help-text" className="text-sm text-gray-600">
        Este botão pode ser ativado via mouse, teclado (Enter/Space) ou tecnologia assistiva.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo demonstrando recursos de acessibilidade do botão.',
      },
    },
  },
}; 