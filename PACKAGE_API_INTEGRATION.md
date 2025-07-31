# Integração com APIs - Componente Package

Este documento explica como o componente `Package.tsx` foi configurado para integrar com as APIs do backend.

## 🔧 APIs Integradas

### 1. **Travel Package API**
```
GET http://localhost:5028/api/TravelPackage/getById/{id}
```
- **Descrição**: Busca informações detalhadas de um pacote de viagem
- **Parâmetro**: `id` - ID do pacote de viagem
- **Retorno esperado**:
```typescript
interface TravelPackage {
  id: number;
  title: string;
  description: string;
  originAddress: {
    city: string;
    country: string;
  };
  destinationAddress: {
    city: string;
    country: string;
  };
  vehicleType: string;
  originalPrice: number;
  price: number;
  packageTax: number;
  discountValue: number;
  duration: string;
  imageUrl?: string;
  images?: string[];
}
```

### 2. **Hotels by City API**
```
GET http://localhost:5028/api/Hotel/by-city/{cityName}
```
- **Descrição**: Busca hotéis disponíveis em uma cidade específica
- **Parâmetro**: `cityName` - Nome da cidade (URL encoded)
- **Exemplos**:
  - `Cancún` → `http://localhost:5028/api/Hotel/by-city/Canc%C3%BAn`
  - `Veneza` → `http://localhost:5028/api/Hotel/by-city/Veneza`
  - `Paris` → `http://localhost:5028/api/Hotel/by-city/Paris`

- **Retorno esperado**:
```typescript
interface Hotel {
  id: number;
  name: string;
  address: string;
  rating: number;
  imageUrl?: string;
  roomTypes: RoomType[];
}

interface RoomType {
  id: number;
  name: string;
  maxGuests: number;
  price: number;
  amenities: Amenity[];
}

interface Amenity {
  id: number;
  name: string;
  iconName: string;
  type?: 'hotel' | 'room';
}
```

### 3. **Hotel Amenities API**
```
GET http://localhost:5028/api/Amenity/Hotel
```
- **Descrição**: Busca todas as amenities disponíveis para hotéis
- **Parâmetros**: Nenhum
- **Retorno esperado**: Array de `Amenity[]`

### 4. **Room Type Amenities API**
```
GET http://localhost:5028/api/Amenity/TypeRoom
```
- **Descrição**: Busca todas as amenities disponíveis para tipos de quarto
- **Parâmetros**: Nenhum
- **Retorno esperado**: Array de `Amenity[]`

## 🚀 Como Usar

### 1. **Configuração da Rota**
Para usar o componente com parâmetros da URL, configure sua rota assim:
```typescript
// App.tsx ou Routes.tsx
<Route path="/package/:packageId" element={<Package />} />
```

### 2. **Exemplos de URLs**
```
http://localhost:3000/package/1    // Pacote ID 1
http://localhost:3000/package/2    // Pacote ID 2
http://localhost:3000/package/5    // Pacote ID 5
```

### 3. **Fluxo de Carregamento**
1. O componente monta e obtém o `packageId` da URL
2. Chama `fetchTravelPackage(packageId)` para buscar dados do pacote
3. Automaticamente chama `fetchHotelsByCity(destinationCity)` baseado na cidade de destino do pacote
4. Busca amenities de hotéis via `fetchHotelAmenities()`
5. Busca amenities de quartos via `fetchRoomAmenities()`
6. Exibe loading enquanto carrega os dados
7. Mostra erro se alguma API falhar
8. Renderiza o componente completo quando os dados estão disponíveis

### 4. **Gerenciamento de Amenities**
As amenities são carregadas separadamente e combinadas com os dados dos hotéis através das funções:
- `getCurrentHotelAmenities()`: Obtém amenities do hotel atual
- `getCurrentRoomTypeAmenities()`: Obtém amenities do tipo de quarto atual

**Prioridade de dados**:
1. Amenities vindas diretamente da API de hotéis (se disponíveis)
2. Amenities das APIs específicas filtradas por tipo
3. Array vazio como fallback

## 🔄 Estados de Carregamento

### Loading
```tsx
{loading ? (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA62B]"></div>
    <span className="ml-2 text-gray-600">Carregando pacote...</span>
  </div>
) : ...}
```

### Error
```tsx
{error ? (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
    <p className="text-red-700 text-center">{error}</p>
    <button onClick={() => fetchTravelPackage(1)}>
      Tentar novamente
    </button>
  </div>
) : ...}
```

## 🌍 Exemplos de Cidades

As seguintes cidades podem ser testadas (desde que existam no banco de dados):

| Cidade Original | URL Encoded | API Call |
|----------------|-------------|----------|
| Cancún | Canc%C3%BAn | `/api/Hotel/by-city/Canc%C3%BAn` |
| São Paulo | S%C3%A3o%20Paulo | `/api/Hotel/by-city/S%C3%A3o%20Paulo` |
| Veneza | Veneza | `/api/Hotel/by-city/Veneza` |
| París | Par%C3%ADs | `/api/Hotel/by-city/Par%C3%ADs` |
| Rio de Janeiro | Rio%20de%20Janeiro | `/api/Hotel/by-city/Rio%20de%20Janeiro` |

## 📊 Dados Mockados (Fallback)

O componente ainda mantém dados mockados para reviews e amenidades como fallback:

### Reviews Mockadas
- 6 avaliações de exemplo
- Estatísticas calculadas automaticamente
- Sistema de estrelas funcional

### Amenidades Mockadas
- **Hotel**: Wi-Fi, Ar condicionado, TV a cabo, Frigobar, Room service 24h
- **Quarto**: Cama king size, Vista para o canal, Banheira hidromassagem, etc.

## 🛠️ Personalização

### Alterar ID Padrão
Para alterar o ID padrão quando nenhum parâmetro é fornecido:
```typescript
const id = packageId ? parseInt(packageId) : 1; // Altere o 1 para o ID desejado
```

### Alterar Base URL da API
```typescript
const response = await axios.get(`http://SEU_SERVIDOR:PORTA/api/TravelPackage/getById/${packageId}`);
```

### Tratamento de Erro Personalizado
```typescript
catch (error) {
  console.error('Erro ao buscar pacote:', error);
  setError('Sua mensagem de erro personalizada');
}
```

## ✅ Checklist de Integração

- [x] ✅ Axios integrado
- [x] ✅ Interface TypeScript definida
- [x] ✅ Estados de loading e error
- [x] ✅ Parâmetros de URL suportados  
- [x] ✅ Encoding de URL para cidades com caracteres especiais
- [x] ✅ Fallback para dados mockados
- [x] ✅ Tratamento de casos edge (hotel não encontrado, etc.)
- [x] ✅ Auto-carregamento de hotéis baseado na cidade de destino

## 🐛 Troubleshooting

### Erro: "Cannot find hotels"
- Verifique se a cidade existe no banco de dados
- Confirme se o nome da cidade está correto
- Teste a API diretamente no browser/Postman

### Erro: "Package not found"
- Verifique se o ID do pacote existe
- Confirme se a API está rodando na porta correta
- Teste com um ID válido conhecido

### Erro: CORS
- Configure CORS no backend para aceitar requests do localhost:3000
- Verifique as headers HTTP permitidas
