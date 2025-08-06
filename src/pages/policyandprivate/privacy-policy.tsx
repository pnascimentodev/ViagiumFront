"use client"

import { useState } from "react"
import { FaShieldAlt, FaUserShield, FaLock, FaEye, FaHandshake, FaEnvelope } from "react-icons/fa"

function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState<string | null>(null)

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section)
    }

    return (
        <div className="bg-[#003194] flex flex-col min-h-screen">
            {/* Background image */}
            <div className="bg-cover bg-center bg-no-repeat bg-[url('https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg')]">
                <div className="flex flex-col bg-gradient-to-b from-[#00319400] to-[#003194FF]">
                    {/* Hero Section */}
                    <div className="flex flex-col justify-center items-center text-center max-w-4xl mx-auto h-[40vh] p-5 gap-4">
                        <div className="text-white mb-4">
                            <FaShieldAlt className="h-16 w-16 mx-auto mb-4" style={{ color: '#ffffff', fill: '#ffffff' }} />
                        </div>
                        <h1 className="text-4xl md:text-5xl text-white font-bold tracking-wider">POLÍTICA DE PRIVACIDADE</h1>
                        <p className="text-xl md:text-2xl text-white mb-2">
                            Transparência e segurança no tratamento dos seus dados
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow w-full max-w-6xl mx-auto p-6 mt-8 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Introduction */}
                    <div className="mb-8">
                        <p className="text-gray-700 text-lg leading-relaxed mb-4">
                            <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            A Viagium valoriza a privacidade e a proteção dos dados pessoais de nossos usuários, parceiros e
                            afiliados. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas
                            informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD) e demais legislações
                            aplicáveis.
                        </p>
                    </div>

                    {/* Quick Navigation */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-bold text-[#003194] mb-4 flex items-center">
                            <FaEye className="mr-2" />
                            Navegação Rápida
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <a href="#dados-coletados" className="text-[#003194] hover:text-orange-500 transition-colors">
                                • Dados que Coletamos
                            </a>
                            <a href="#como-usamos" className="text-[#003194] hover:text-orange-500 transition-colors">
                                • Como Usamos seus Dados
                            </a>
                            <a href="#compartilhamento" className="text-[#003194] hover:text-orange-500 transition-colors">
                                • Compartilhamento de Dados
                            </a>
                            <a href="#seguranca" className="text-[#003194] hover:text-orange-500 transition-colors">
                                • Segurança dos Dados
                            </a>
                            <a href="#seus-direitos" className="text-[#003194] hover:text-orange-500 transition-colors">
                                • Seus Direitos
                            </a>
                            <a href="#contato" className="text-[#003194] hover:text-orange-500 transition-colors">
                                • Contato
                            </a>
                        </div>
                    </div>

                    {/* Section 1: Dados Coletados */}
                    <section id="dados-coletados" className="mb-8">
                        <div
                            className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => toggleSection("dados-coletados")}
                        >
                            <h2 className="text-2xl font-bold text-[#003194] flex items-center">
                                <FaUserShield className="mr-3" />
                                1. Dados que Coletamos
                            </h2>
                            <span className="text-[#003194] text-xl">{activeSection === "dados-coletados" ? "−" : "+"}</span>
                        </div>

                        {activeSection === "dados-coletados" && (
                            <div className="mt-4 p-6 border-l-4 border-[#003194] bg-blue-50">
                                <h3 className="text-lg font-semibold text-[#003194] mb-3">Dados Empresariais de Afiliados:</h3>
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                                    <li>Razão Social da empresa</li>
                                    <li>Nome Fantasia</li>
                                    <li>CNPJ (Cadastro Nacional da Pessoa Jurídica)</li>
                                    <li>Inscrição Estadual</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-[#003194] mb-3">Dados de Contato:</h3>
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                                    <li>E-mail de acesso (com confirmação)</li>
                                    <li>Telefone principal</li>
                                    <li>Telefone secundário (opcional)</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-[#003194] mb-3">Dados de Endereço:</h3>
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                                    <li>CEP (Código de Endereçamento Postal)</li>
                                    <li>Logradouro (rua/avenida)</li>
                                    <li>Número do endereço</li>
                                    <li>Bairro</li>
                                    <li>Cidade</li>
                                    <li>Estado</li>
                                    <li>País</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-[#003194] mb-3">Dados de Acesso:</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Senha de acesso (armazenada de forma criptografada)</li>
                                    <li>Histórico de login e atividades na plataforma</li>
                                </ul>

                                <h3 className="text-lg font-semibold text-[#003194] mb-3">Dados de Navegação:</h3>
                                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                                    <li>Endereço IP, tipo de navegador, sistema operacional</li>
                                    <li>Páginas visitadas, tempo de permanência, origem do acesso</li>
                                    <li>Cookies e tecnologias similares</li>
                                </ul>
                            </div>
                        )}
                    </section>

                    {/* Section 2: Como Usamos */}
                    <section id="como-usamos" className="mb-8">
                        <div
                            className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => toggleSection("como-usamos")}
                        >
                            <h2 className="text-2xl font-bold text-[#003194] flex items-center">
                                <FaHandshake className="mr-3" />
                                2. Como Usamos seus Dados
                            </h2>
                            <span className="text-[#003194] text-xl">{activeSection === "como-usamos" ? "−" : "+"}</span>
                        </div>

                        {activeSection === "como-usamos" && (
                            <div className="mt-4 p-6 border-l-4 border-orange-500 bg-orange-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#003194] mb-3">Finalidades Principais:</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Cadastro e gestão de afiliados</li>
                                            <li>Processamento de reservas</li>
                                            <li>Cálculo e pagamento de comissões</li>
                                            <li>Comunicação sobre serviços</li>
                                            <li>Suporte técnico e atendimento</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#003194] mb-3">Finalidades Secundárias:</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Análise de crédito e risco</li>
                                            <li>Prevenção à fraude</li>
                                            <li>Melhoria dos serviços</li>
                                            <li>Marketing direcionado</li>
                                            <li>Cumprimento de obrigações legais</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Section 3: Compartilhamento */}
                    <section id="compartilhamento" className="mb-8">
                        <div
                            className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => toggleSection("compartilhamento")}
                        >
                            <h2 className="text-2xl font-bold text-[#003194] flex items-center">
                                <FaHandshake className="mr-3" />
                                3. Compartilhamento de Dados
                            </h2>
                            <span className="text-[#003194] text-xl">{activeSection === "compartilhamento" ? "−" : "+"}</span>
                        </div>

                        {activeSection === "compartilhamento" && (
                            <div className="mt-4 p-6 border-l-4 border-green-500 bg-green-50">
                                <p className="text-gray-700 mb-4">
                                    Seus dados podem ser compartilhados apenas nas seguintes situações:
                                </p>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    <li>
                                        <strong>Prestadores de serviços:</strong> empresas que nos auxiliam na operação (processamento de
                                        pagamentos, análise de crédito, hospedagem de dados)
                                    </li>
                                    <li>
                                        <strong>Parceiros comerciais:</strong> hotéis e estabelecimentos parceiros, apenas dados necessários
                                        para a prestação do serviço
                                    </li>
                                    <li>
                                        <strong>Órgãos reguladores:</strong> quando exigido por lei ou determinação judicial
                                    </li>
                                    <li>
                                        <strong>Proteção de direitos:</strong> para proteger nossos direitos, propriedade ou segurança
                                    </li>
                                </ul>
                                <div className="mt-4 p-4 bg-white rounded border-l-4 border-red-500">
                                    <p className="text-gray-700 font-semibold">
                                        ⚠️ Importante: Nunca vendemos seus dados pessoais para terceiros.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Section 4: Segurança */}
                    <section id="seguranca" className="mb-8">
                        <div
                            className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => toggleSection("seguranca")}
                        >
                            <h2 className="text-2xl font-bold text-[#003194] flex items-center">
                                <FaLock className="mr-3" />
                                4. Segurança dos Dados
                            </h2>
                            <span className="text-[#003194] text-xl">{activeSection === "seguranca" ? "−" : "+"}</span>
                        </div>

                        {activeSection === "seguranca" && (
                            <div className="mt-4 p-6 border-l-4 border-purple-500 bg-purple-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#003194] mb-3">Medidas Técnicas:</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Criptografia SSL/TLS</li>
                                            <li>Senhas criptografadas</li>
                                            <li>Firewalls e sistemas de proteção</li>
                                            <li>Monitoramento 24/7</li>
                                            <li>Backups seguros</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#003194] mb-3">Medidas Organizacionais:</h3>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Acesso restrito aos dados</li>
                                            <li>Treinamento de funcionários</li>
                                            <li>Políticas internas de segurança</li>
                                            <li>Auditorias regulares</li>
                                            <li>Contratos de confidencialidade</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Section 5: Seus Direitos */}
                    <section id="seus-direitos" className="mb-8">
                        <div
                            className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => toggleSection("seus-direitos")}
                        >
                            <h2 className="text-2xl font-bold text-[#003194] flex items-center">
                                <FaUserShield className="mr-3" />
                                5. Seus Direitos (LGPD)
                            </h2>
                            <span className="text-[#003194] text-xl">{activeSection === "seus-direitos" ? "−" : "+"}</span>
                        </div>

                        {activeSection === "seus-direitos" && (
                            <div className="mt-4 p-6 border-l-4 border-blue-500 bg-blue-50">
                                <p className="text-gray-700 mb-4">
                                    Conforme a LGPD, você tem os seguintes direitos sobre seus dados pessoais:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg">
                                        <h4 className="font-semibold text-[#003194] mb-2">✓ Confirmação e Acesso</h4>
                                        <p className="text-sm text-gray-600">Saber se tratamos seus dados e ter acesso a eles</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <h4 className="font-semibold text-[#003194] mb-2">✓ Correção</h4>
                                        <p className="text-sm text-gray-600">Corrigir dados incompletos, inexatos ou desatualizados</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <h4 className="font-semibold text-[#003194] mb-2">✓ Eliminação</h4>
                                        <p className="text-sm text-gray-600">Solicitar a exclusão de dados desnecessários</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <h4 className="font-semibold text-[#003194] mb-2">✓ Portabilidade</h4>
                                        <p className="text-sm text-gray-600">Transferir dados para outro fornecedor</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <h4 className="font-semibold text-[#003194] mb-2">✓ Oposição</h4>
                                        <p className="text-sm text-gray-600">Opor-se ao tratamento em certas situações</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <h4 className="font-semibold text-[#003194] mb-2">✓ Revogação</h4>
                                        <p className="text-sm text-gray-600">Retirar consentimento a qualquer momento</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Section 6: Cookies */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#003194] mb-4">6. Cookies e Tecnologias Similares</h2>
                        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                            <p className="text-gray-700 mb-4">
                                Utilizamos cookies para melhorar sua experiência em nosso site. Os cookies são pequenos arquivos
                                armazenados em seu dispositivo que nos ajudam a:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                                <li>Manter você logado em sua conta</li>
                                <li>Lembrar suas preferências</li>
                                <li>Analisar o uso do site</li>
                                <li>Personalizar conteúdo e anúncios</li>
                            </ul>
                            <p className="text-gray-700">Você pode gerenciar cookies através das configurações do seu navegador.</p>
                        </div>
                    </section>

                    {/* Section 7: Retenção */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#003194] mb-4">7. Retenção de Dados</h2>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-700 mb-4">Mantemos seus dados pessoais apenas pelo tempo necessário para:</p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                <li>Cumprir as finalidades para as quais foram coletados</li>
                                <li>Atender obrigações legais e regulamentares</li>
                                <li>Exercer direitos em processos judiciais</li>
                                <li>Dados de afiliados ativos: durante a vigência do contrato + 5 anos</li>
                                <li>Dados fiscais e contábeis: conforme legislação aplicável</li>
                            </ul>
                        </div>
                    </section>

                    {/* Updates Section */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-[#003194] mb-4">8. Atualizações desta Política</h2>
                        <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                            <p className="text-gray-700 mb-4">
                                Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas
                                práticas ou na legislação aplicável.
                            </p>
                            <p className="text-gray-700">
                                <strong>Recomendamos que você revise esta página regularmente.</strong> Alterações significativas serão
                                comunicadas por e-mail ou através de avisos em nosso site.
                            </p>
                        </div>
                    </section>

                    {/* Footer CTA */}
                    <div className="text-center pt-8 border-t border-gray-200">
                        <p className="text-gray-600 mb-4">Tem dúvidas sobre nossa Política de Privacidade?</p>
                        <a
                            href="mailto:viagium@gmail.com"
                            className="inline-flex items-center bg-[#003194] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a7a] transition-colors"
                        >
                            <FaEnvelope className="mr-2" style={{ color: '#ffffff', fill: '#ffffff' }}/>
                            Entre em Contato
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicyPage
