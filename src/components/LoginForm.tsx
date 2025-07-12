
import { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Store, Mail, Lock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { translations } from '../lib/translations';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ne'>('en');
  const { signIn, signUp } = useSupabaseAuth();
  const { toast } = useToast();

  const t = (key: keyof typeof translations.en) => translations[currentLanguage][key];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Success",
          description: "Logged in successfully!"
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email for verification."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
            <div className="flex gap-1">
              <Button
                variant={currentLanguage === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentLanguage('en')}
              >
                EN
              </Button>
              <Button
                variant={currentLanguage === 'ne' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentLanguage('ne')}
              >
                नेप
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('header.title')}</CardTitle>
          <CardDescription>
            {isLogin ? t('auth.signIn') : t('auth.signUp')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? t('auth.signIn') : t('auth.signUp'))}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
