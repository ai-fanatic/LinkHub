import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
}

export function SecretCodeModal({ isOpen, onClose, onVerify }: SecretCodeModalProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!code.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a secret code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const isValid = await onVerify(code);
      if (!isValid) {
        toast({
          title: 'Error',
          description: 'Invalid secret code',
          variant: 'destructive',
        });
      } else {
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Secret Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter your secret code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleVerify();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
