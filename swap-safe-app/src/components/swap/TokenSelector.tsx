'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Search, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTokens } from '@/hooks/useTokens';
import type { Token, CustomToken } from '@/types/tokens';

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  otherToken?: Token | null; // Para evitar selecionar o mesmo token dos dois lados
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function TokenSelector({
  selectedToken,
  onSelectToken,
  otherToken,
  label = "Token",
  placeholder = "Selecionar token",
  disabled = false,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  
  const { 
    tokens, 
    customTokens, 
    searchTokens, 
    addCustomToken, 
    removeCustomToken,
    isLoading, 
    error 
  } = useTokens();

  // Filtrar tokens baseado na busca
  const filteredTokens = useMemo(() => {
    const results = searchQuery ? searchTokens(searchQuery) : tokens;
    
    // Remover o token já selecionado do outro lado
    return results.filter(token => {
      if (otherToken && token.address.toLowerCase() === otherToken.address.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [searchQuery, searchTokens, tokens, otherToken]);

  // Tokens populares (primeiros da lista)
  const popularTokens = useMemo(() => {
    return filteredTokens.slice(0, 6);
  }, [filteredTokens]);

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    setOpen(false);
    setSearchQuery('');
  };

  const handleRemoveCustomToken = (address: string) => {
    removeCustomToken(address);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium leading-none mb-2 block">
          {label}
        </label>
      )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12"
            disabled={disabled}
          >
            {selectedToken ? (
              <div className="flex items-center space-x-2">
                {selectedToken.logoURI && (
                  <img 
                    src={selectedToken.logoURI} 
                    alt={selectedToken.symbol}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex flex-col items-start">
                  <span className="font-medium">{selectedToken.symbol}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-32">
                    {selectedToken.name}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Token</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Campo de busca */}
            <Input
              placeholder="Buscar por nome, símbolo ou endereço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              loading={isLoading}
            />
            
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            {/* Tokens populares */}
            {!searchQuery && (
              <div>
                <h3 className="text-sm font-medium mb-2">Tokens Populares</h3>
                <div className="grid grid-cols-2 gap-2">
                  {popularTokens.map((token) => (
                    <Button
                      key={`${token.address}-${token.chainId}`}
                      variant="outline"
                      className="justify-start h-auto p-3"
                      onClick={() => handleSelectToken(token)}
                    >
                      <div className="flex items-center space-x-2">
                        {token.logoURI && (
                          <img 
                            src={token.logoURI} 
                            alt={token.symbol}
                            className="w-5 h-5 rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{token.symbol}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-16">
                            {token.name}
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Separator />
            
            {/* Lista de todos os tokens */}
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredTokens.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Nenhum token encontrado' : 'Carregando tokens...'}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setShowAddCustom(true)}
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Adicionar token customizado
                    </Button>
                  )}
                </div>
              ) : (
                filteredTokens.map((token) => (
                  <Button
                    key={`${token.address}-${token.chainId}`}
                    variant="ghost"
                    className="w-full justify-between h-auto p-3"
                    onClick={() => handleSelectToken(token)}
                  >
                    <div className="flex items-center space-x-3">
                      {token.logoURI && (
                        <img 
                          src={token.logoURI} 
                          alt={token.symbol}
                          className="w-6 h-6 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex flex-col items-start">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{token.symbol}</span>
                          {('isCustom' in token && (token as any).isCustom) && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground truncate max-w-48">
                          {token.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {token.address.slice(0, 6)}...{token.address.slice(-4)}
                        </span>
                      </div>
                    </div>
                    
                    {('isCustom' in token && (token as any).isCustom) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCustomToken(token.address);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </Button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}