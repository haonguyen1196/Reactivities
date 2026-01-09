import { useForm } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { Link } from "react-router";
import {
    registerSchema,
    type RegisterSchema,
} from "../../lib/schemas/registerSchema";

export default function RegisterForm() {
    const { registerUser } = useAccount();
    const {
        control,
        handleSubmit,
        setError,
        formState: { isValid, isSubmitting },
    } = useForm<RegisterSchema>({
        mode: "onTouched",
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterSchema) => {
        await registerUser.mutateAsync(data, {
            onError: (error) => {
                if (Array.isArray(error)) {
                    error.forEach((err) => {
                        if (err.includes("Email"))
                            setError("email", { message: err });
                        else if (err.includes("Password"))
                            setError("password", { message: err });
                    });
                } // error response from API set into setError
            },
        });
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "flex",
                flexDirection: "column",
                p: 3,
                gap: 3,
                maxWidth: "md",
                mx: "auto",
                borderRadius: 3,
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={3}
                color="secondary.main"
            >
                <LockOpen fontSize="large" />
                <Typography variant="h4">Register</Typography>
            </Box>
            <TextInput label="Email" control={control} name="email" />
            <TextInput
                label="Display name"
                control={control}
                name="displayName"
            />
            <TextInput
                label="Password"
                type="password"
                control={control}
                name="password"
            />
            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                variant="contained"
                size="large"
            >
                Register
            </Button>
            {/* <Button
                onClick={loginWithGithub}
                startIcon={<GitHub />}
                sx={{backgroundColor: 'black'}}
                type="button"
                variant="contained"
                size="large"
            >
                Login with Github
            </Button>
            {notVerified ? (
                <Box display='flex' flexDirection='column' justifyContent='center'>
                    <Typography textAlign='center' color='error'>
                        Your email has not been verified.  You can click the button to re-send the verification email
                    </Typography>
                    <Button
                        disabled={resendConfirmationEmail.isPending}
                        onClick={handleResendEmail}
                    >
                        Re-send email link
                    </Button>
                </Box>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' gap={3}>
                    <Typography>
                        Forgot password? Click <Link to='/forgot-password'>here</Link>
                    </Typography>

                    <Typography sx={{ textAlign: 'center' }}>
                        Don't have an account?
                        <Typography sx={{ ml: 2 }} component={Link} to='/register' color="primary">
                            Sign up
                        </Typography>
                    </Typography>
                </Box>
            )} */}
            <Typography sx={{ textAlign: "center" }}>
                Already have an account?
                <Typography
                    sx={{ ml: 2 }}
                    component={Link}
                    to="/login"
                    color="primary"
                >
                    Sign up
                </Typography>
            </Typography>
        </Paper>
    );
}
